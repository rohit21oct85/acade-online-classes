const express =  require("express");
const Chapter = require('../../http/controllers/admin/chapterController.js');
const checkAuth =  require("../../http/middleware/check-auth");
const adminAuth =  require("../../http/middleware/admin-auth");
const router = express.Router();

router
    .post('/create', checkAuth, Chapter.CreateChapter)
    .patch('/update/:id', checkAuth, Chapter.UpdateChapter)
    .get('/view/:id', checkAuth, Chapter.ViewChapter)
    .get('/view-all/:class_id?/:subject_id?/:unit_id?', checkAuth, Chapter.ViewAllChapter)
    .delete('/delete/:id', checkAuth, Chapter.DeleteChapter)
;

module.exports = router;