import mongoose from 'mongoose';

// Blog post schema
const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: [String],
    published: {
        type: Boolean,
        default: true
    }
});

const UserSchema = new mongoose.Schema({
    // Authentication fields
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    firebaseUid: {
        type: String,
        required: [true, 'Firebase UID is required'],
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    approvalRequest: {
        type: Boolean,
        default: false,
    },

    // Profile fields
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        default: 'Software Engineer'
    },
    image: {
        type: String,
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
    },
    aboutYourself: {
        type: String,
        required: [true, 'About yourself is required'],
    },
    background: {
        type: String,
        required: [true, 'Background is required'],
    },
    skills: [{
        name: String,
        proficiency: Number,
        category: String,
    }],
    experience: [{
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
        current: Boolean,
    }],
    education: [{
        school: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        description: String,
    }],
    projects: [{
        title: String,
        description: String,
        image: String,
        demoUrl: String,
        githubUrl: String,
        technologies: String,
        featured: {
            type: Boolean,
            default: false
        },
    }],
    blogPosts: [BlogPostSchema],
    socialLinks: {
        github: String,
        linkedin: String,
        facebook: String,
        twitter: String,
        website: String,
    },
    contact: {
        email: {
            type: String,
            required: [true, 'Email is required'],
        },
        phone: String,
        location: String,
    },
    certifications: [{
        title: {
            type: String,
            required: true
        },
        issuer: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            default: '#'
        }
    }],
}, {
    timestamps: true,
});

// Create compound index for unique slugs per user
UserSchema.index({ 'blogPosts.slug': 1, firebaseUid: 1 }, { unique: true, sparse: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User; 