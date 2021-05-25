const express =  require("express");
const Category = require('../../http/controllers/admin/categoryController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Category.CreateCategory)
    .patch('/update/:id',checkAuth,adminAuth, Category.UpdateCategory)
    .patch('/update/segment/:category_id?/:segment_id?',checkAuth,adminAuth, Category.UpdateSegment)
    .get('/view/:id',checkAuth,adminAuth, Category.ViewCategory)
    .get('/view-all',checkAuth,adminAuth, Category.ViewAllCategory)
    .delete('/delete/:id', checkAuth,adminAuth, Category.DeleteCategory);

module.exports = router;