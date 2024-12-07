import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            retryReads: true,
        };

        mongoose.set('strictQuery', true);
        
        try {
            console.log('Attempting MongoDB connection...');
            cached.promise = mongoose.connect(MONGODB_URI, opts);
            console.log('MongoDB connection initiated');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            cached.promise = null;
            throw error;
        }
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connected successfully to:', mongoose.connection.host);
    } catch (e) {
        cached.promise = null;
        console.error('Error establishing connection:', e);
        if (e.name === 'MongooseServerSelectionError') {
            console.error('Connection Details:', {
                uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
                error: e.message,
                reason: e.reason
            });
        }
        throw e;
    }

    return cached.conn;
}

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    cached.conn = null;
    cached.promise = null;
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
});

// Handle process termination
process.on('SIGINT', async () => {
    if (cached.conn) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
});

export default connectDB;