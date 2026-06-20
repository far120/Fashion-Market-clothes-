module.exports = (Model) => async (req, res, next) => {
    try {
        const isOrderModel = Model && Model.modelName === 'Order';

        const orderPopulates = [
            {
                path: 'user',
                select: 'username email image role'
            },
            {
                path: 'items.product',
                select: 'name price image available category'
            }
        ];

        // ======================
        // 📌 Pagination
        // ======================
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 5, 1);
        const skip = (page - 1) * limit;

        // ======================
        // 📌 Sorting
        // ======================
        const sortBy = req.query.sort || 'createdAt';
        const order = req.query.order === 'desc' ? -1 : 1;

        // ======================
        // 📌 Filtering (Safe)
        // ======================
        const excludedFields = ['page', 'limit', 'sort', 'order', 'select', 'populate'];

        const allowedFilters = [
            'email',
            'username',
            'action',
            'user',
            'status',
            'role',
            'isActive',
            'createdAt',
            'updatedAt'
        ];

        let filter = {};

        Object.keys(req.query).forEach(key => {
            if (
                !excludedFields.includes(key) &&
                allowedFilters.includes(key)
            ) {
                if (key === 'isActive') {
                    filter[key] = req.query[key] === 'true';
                } else {
                    filter[key] = req.query[key];
                }
            }
        });
        // 🔥 ROLE BASED FILTER (ADD THIS)
if (req.user && req.user.role !== "admin") {
    filter.user = req.user._id;
}

        // ======================
        // 📌 Select (Projection)
        // ======================
        const forbiddenFields = ['password', '__v'];

        let select = '';

        if (req.query.select) {
            const fields = req.query.select
                .split(',')
                .map(f => f.trim());

            const safeFields = fields.filter(
                field => !forbiddenFields.includes(field)
            );

            select = safeFields.join(' ');
        }

        // ======================
        // 📌 Populate (Dynamic + Safe)
        // ======================
        const allowedPopulate = ['user', 'role', 'items', 'items.product', 'category'];

        let populateFields = [];

        if (req.query.populate) {
            populateFields = req.query.populate
                .split(',')
                .map(f => f.trim())
                .filter(f => allowedPopulate.includes(f));
        }

        // ======================
        // 📌 Build Query
        // ======================
        let query = Model.find(filter)
            .select(select || '-password')
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        // Apply populate
        if (populateFields.length > 0) {
            populateFields.forEach(field => {
                query = query.populate(field);
            });
        }

        if (isOrderModel) {
            orderPopulates.forEach((populate) => {
                query = query.populate(populate);
            });
        }

        // ======================
        // 📌 Execute Query
        // ======================
        const [result, total] = await Promise.all([
            query,
            Model.countDocuments(filter)
        ]);

        // ======================
        // 📌 Response
        // ======================
        res.paginatedResult = {
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            resultsCount: result.length,
            result
        };

        next();

    } catch (err) {
        next(err);
    }
};