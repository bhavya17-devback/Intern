const express = require('express');
const router = express.Router();
const {
  getPendingNgos,
  verifyNgo,
  getAllUsers,
  updateUserStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

// 28 Aug Routes
router.get('/ngos/pending', getPendingNgos);
router.patch('/ngos/:id/verify', verifyNgo);

// 31 Aug Routes
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;