// models/Notice.model.js
import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Notice description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['Academic', 'Administrative', 'Events', 'Announcements'],
    required: [true, 'Category is required']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Posted by is required']
  },
  targetAudience: [{
    type: String,
    enum: ['ADMIN', 'FACULTY', 'STUDENT', 'ALL'],
    required: true
  }],
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    publicId: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if notice is expired
noticeSchema.virtual('isExpired').get(function () {
  return this.expiresAt && this.expiresAt < new Date();
});

// Virtual for formatted date
noticeSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Pre-find middleware to filter notices
noticeSchema.pre(/^find/, function (next) {
  // Don't filter if explicitly querying for inactive notices
  if (!this.getQuery().isActive) {
    this.where({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });
  }
  next();
});

// Add view method
noticeSchema.methods.addView = async function (userId) {
  // Check if user has already viewed this notice
  const alreadyViewed = this.viewedBy.some(view =>
    view.user.toString() === userId.toString()
  );

  if (!alreadyViewed) {
    this.viewedBy.push({ user: userId });
    this.viewCount += 1;
    await this.save();
  }

  return this;
};

// Index for better query performance
noticeSchema.index({ title: 'text', description: 'text' });
noticeSchema.index({ category: 1 });
noticeSchema.index({ postedBy: 1 });
noticeSchema.index({ targetAudience: 1 });
noticeSchema.index({ priority: 1 });
noticeSchema.index({ isActive: 1 });
noticeSchema.index({ isPinned: 1 });
noticeSchema.index({ expiresAt: 1 });
noticeSchema.index({ createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
