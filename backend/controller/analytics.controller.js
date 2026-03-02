// controller/analytics.controller.js
import User from '../models/User.model.js';
import Notice from '../models/Notice.model.js';
import { validationResult } from 'express-validator';

// Get comprehensive analytics data (admin only)
const getAnalytics = async (req, res) => {
  try {
    const { dateRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Overview stats
    const totalUsers = await User.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalViews = await Notice.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]);
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
    const newNotices = await Notice.countDocuments({ createdAt: { $gte: startDate } });

    // User statistics
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const usersByDepartment = await User.aggregate([
      { $match: { department: { $ne: null, $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Registration trend
    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          users: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Active users trend (mock data for now - would need login tracking)
    const activeUsersTrend = await User.aggregate([
      { $match: { lastLogin: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' } },
          active: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Notice statistics
    const noticesByCategory = await Notice.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const noticesByPriority = await Notice.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Views trend
    const viewsTrend = await Notice.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: '$viewCount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular notices
    const popularNotices = await Notice.find()
      .sort({ viewCount: -1 })
      .limit(10)
      .select('title category viewCount createdAt')
      .lean();

    // System stats (mock data - would need analytics collection)
    const deviceUsage = { 'Desktop': 687, 'Mobile': 412, 'Tablet': 148 };
    const browserUsage = { 'Chrome': 723, 'Firefox': 234, 'Safari': 198, 'Edge': 145, 'Other': 47 };
    
    // Peak hours (mock data)
    const peakHours = [
      { hour: '08:00', users: 234 },
      { hour: '09:00', users: 456 },
      { hour: '10:00', users: 567 },
      { hour: '11:00', users: 623 },
      { hour: '12:00', users: 445 },
      { hour: '13:00', users: 334 },
      { hour: '14:00', users: 478 },
      { hour: '15:00', users: 512 },
      { hour: '16:00', users: 423 },
      { hour: '17:00', users: 345 },
      { hour: '18:00', users: 278 },
      { hour: '19:00', users: 234 }
    ];

    const analytics = {
      overview: {
        totalUsers,
        totalNotices,
        totalViews: totalViews[0]?.totalViews || 0,
        activeUsers,
        newUsers,
        newNotices
      },
      userStats: {
        byRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byDepartment: usersByDepartment.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        registrationTrend,
        activeUsers: activeUsersTrend
      },
      noticeStats: {
        byCategory: noticesByCategory.reduce((acc, item) => {
          acc[item._id || 'General'] = item.count;
          return acc;
        }, {}),
        byPriority: noticesByPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        viewsTrend,
        popularNotices
      },
      systemStats: {
        deviceUsage,
        browserUsage,
        peakHours,
        serverLoad: [
          { time: '00:00', load: 12 },
          { time: '04:00', load: 8 },
          { time: '08:00', load: 45 },
          { time: '12:00', load: 67 },
          { time: '16:00', load: 54 },
          { time: '20:00', load: 34 },
          { time: '23:59', load: 18 }
        ]
      }
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
};

// Get user analytics specifically
const getUserAnalytics = async (req, res) => {
  try {
    const { dateRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const usersByDepartment = await User.aggregate([
      { $match: { department: { $ne: null, $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          users: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        usersByDepartment: usersByDepartment.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        registrationTrend
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user analytics'
    });
  }
};

// Get notice analytics specifically
const getNoticeAnalytics = async (req, res) => {
  try {
    const { dateRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const totalNotices = await Notice.countDocuments();
    const newNotices = await Notice.countDocuments({ createdAt: { $gte: startDate } });
    
    const noticesByCategory = await Notice.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const noticesByPriority = await Notice.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const popularNotices = await Notice.find()
      .sort({ viewCount: -1 })
      .limit(10)
      .select('title category viewCount createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalNotices,
        newNotices,
        noticesByCategory: noticesByCategory.reduce((acc, item) => {
          acc[item._id || 'General'] = item.count;
          return acc;
        }, {}),
        noticesByPriority: noticesByPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        popularNotices
      }
    });
  } catch (error) {
    console.error('Get notice analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice analytics'
    });
  }
};

export {
  getAnalytics,
  getUserAnalytics,
  getNoticeAnalytics
};
