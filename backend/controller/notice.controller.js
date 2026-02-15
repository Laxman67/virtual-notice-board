// controller/notice.controller.js
import Notice from '../models/Notice.model.js';
import { validationResult } from 'express-validator'; ``

// Create new notice
const createNotice = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, category, targetAudience, priority, expiresAt, tags } = req.body;

    // Create notice
    const notice = new Notice({
      title,
      description,
      category,
      postedBy: req.user._id,
      targetAudience: targetAudience.includes('ALL') ? ['ALL'] : targetAudience,
      priority: priority || 'MEDIUM',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      tags: tags || []
    });

    await notice.save();
    await notice.populate('postedBy', 'name email role');

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      const noticeData = {
        ...notice.toObject(),
        postedBy: {
          _id: req.user._id,
          name: req.user.name,
          role: req.user.role
        }
      };

      // Broadcast to target audience
      if (notice.targetAudience.includes('ALL')) {
        io.emit('new-notice', noticeData);
      } else {
        notice.targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('new-notice', noticeData);
        });
      }

      // Send notification event
      const notificationMessage = `New notice: ${notice.title}`;
      if (notice.targetAudience.includes('ALL')) {
        io.emit('notification', {
          message: notificationMessage,
          type: notice.priority === 'HIGH' ? 'warning' : 'info',
          timestamp: new Date(),
          noticeId: notice._id
        });
      } else {
        notice.targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notification', {
            message: notificationMessage,
            type: notice.priority === 'HIGH' ? 'warning' : 'info',
            timestamp: new Date(),
            noticeId: notice._id
          });
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all notices (with filtering)
const getNotices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Filter by user's role and target audience
    if (req.user.role !== 'ADMIN') {
      query.$or = [
        { targetAudience: 'ALL' },
        { targetAudience: req.user.role }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notices = await Notice.find(query)
      .populate('postedBy', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notice.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        notices,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices'
    });
  }
};

// Get single notice
const getNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id)
      .populate('postedBy', 'name email role');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user can view this notice
    if (req.user.role !== 'ADMIN') {
      const canView = notice.targetAudience.includes('ALL') ||
        notice.targetAudience.includes(req.user.role);

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Add view tracking
    await notice.addView(req.user._id);

    // Emit view event for analytics
    const io = req.app.get('io');
    if (io) {
      io.emit('view-notice', {
        noticeId: notice._id,
        userId: req.user._id
      });
    }

    res.status(200).json({
      success: true,
      data: { notice }
    });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice'
    });
  }
};

// Update notice
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, targetAudience, priority, expiresAt, tags, isActive, isPinned } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check permissions
    if ((req.user.role !== 'ADMIN' || req.user.role !== 'FACULTY') && notice.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Unauthorized to update this notice.'
      });
    }

    // Update fields
    if (title) notice.title = title;
    if (description) notice.description = description;
    if (category) notice.category = category;
    if (targetAudience) notice.targetAudience = targetAudience.includes('ALL') ? ['ALL'] : targetAudience;
    if (priority) notice.priority = priority;
    if (expiresAt !== undefined) notice.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (tags) notice.tags = tags;
    if (isActive !== undefined) notice.isActive = isActive;
    if (isPinned !== undefined) notice.isPinned = isPinned;

    await notice.save();
    await notice.populate('postedBy');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const noticeData = notice.toObject();

      // Broadcast to target audience
      if (notice.targetAudience.includes('ALL')) {
        io.emit('notice-updated', noticeData);
      } else {
        notice.targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notice-updated', noticeData);
        });
      }

      // Send notification event
      const notificationMessage = `Notice updated: ${notice.title}`;
      if (notice.targetAudience.includes('ALL')) {
        io.emit('notification', {
          message: notificationMessage,
          type: 'info',
          timestamp: new Date(),
          noticeId: notice._id
        });
      } else {
        notice.targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notification', {
            message: notificationMessage,
            type: 'info',
            timestamp: new Date(),
            noticeId: notice._id
          });
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notice'
    });
  }
};

// Delete notice
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check permissions
    if ((req.user.role !== 'ADMIN' || req.user.role !== 'FACULTY') && notice.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Unauthorized to update this notice.'
      });
    }

    await Notice.findByIdAndDelete(id);

    // Emit real-time deletion
    const io = req.app.get('io');
    if (io) {
      const deletionData = {
        noticeId: id,
        targetAudience: notice.targetAudience,
        title: notice.title
      };

      // Broadcast to target audience
      if (notice.targetAudience.includes('ALL')) {
        io.emit('notice-deleted', deletionData);
      } else {
        notice.targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notice-deleted', deletionData);
        });
      }

      // Send notification event
      const notificationMessage = `Notice deleted: ${notice.title}`;
      if (notice.targetAudience.includes('ALL')) {
        io.emit('notification', {
          message: notificationMessage,
          type: 'info',
          timestamp: new Date(),
          noticeId: id
        });
      } else {
        notice.targetAudience.forEach(role => {
          io.to(`role-${role}`).emit('notification', {
            message: notificationMessage,
            type: 'info',
            timestamp: new Date(),
            noticeId: id
          });
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice'
    });
  }
};

// Get notice statistics (for admin dashboard)
const getNoticeStats = async (req, res) => {
  try {
    // Only admin can access stats
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalNotices = await Notice.countDocuments();
    const activeNotices = await Notice.countDocuments({ isActive: true });
    const expiredNotices = await Notice.countDocuments({
      expiresAt: { $lt: new Date() }
    });
    const pinnedNotices = await Notice.countDocuments({ isPinned: true });

    // Notices by category
    const noticesByCategory = await Notice.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { categoryName: '$_id', count: 1 } }
    ]);

    // Notices by priority
    const noticesByPriority = await Notice.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Recent views (last 7 days)
    const recentViews = await Notice.aggregate([
      { $unwind: '$viewedBy' },
      { $match: { 'viewedBy.viewedAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $count: 'totalViews' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalNotices,
        activeNotices,
        expiredNotices,
        pinnedNotices,
        noticesByCategory,
        noticesByPriority,
        recentViews: recentViews[0]?.totalViews || 0
      }
    });
  } catch (error) {
    console.error('Get notice stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice statistics'
    });
  }
};

export {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
  getNoticeStats
};
