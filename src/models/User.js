import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
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
    blogPosts: [{
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
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
    }],
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
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User; 