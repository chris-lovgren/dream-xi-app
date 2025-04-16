import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        maxlength: [50, 'Team name cannot exceed 50 characters']
    },
    formation: {
        type: String,
        required: [true, 'Formation is required'],
        enum: {
            values: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'],
            message: 'Invalid formation'
        }
    },
    players: {
        goalkeeper: {
            type: String,
            required: [true, 'Goalkeeper is required'],
            trim: true
        },
        defenders: {
            type: [String],
            required: [true, 'Defenders are required'],
            validate: {
                validator: function(v) {
                    return v.length === parseInt(this.formation.split('-')[0]);
                },
                message: 'Number of defenders must match formation'
            }
        },
        midfielders: {
            type: [String],
            required: [true, 'Midfielders are required'],
            validate: {
                validator: function(v) {
                    return v.length === parseInt(this.formation.split('-')[1]);
                },
                message: 'Number of midfielders must match formation'
            }
        },
        forwards: {
            type: [String],
            required: [true, 'Forwards are required'],
            validate: {
                validator: function(v) {
                    return v.length === parseInt(this.formation.split('-')[2]);
                },
                message: 'Number of forwards must match formation'
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for total players
teamSchema.virtual('totalPlayers').get(function() {
    return 1 + this.players.defenders.length + 
           this.players.midfielders.length + 
           this.players.forwards.length;
});

// Virtual for formation display
teamSchema.virtual('formationDisplay').get(function() {
    return this.formation.split('-').join('-');
});

// Instance method to get all players
teamSchema.methods.getAllPlayers = function() {
    return {
        goalkeeper: this.players.goalkeeper,
        defenders: this.players.defenders,
        midfielders: this.players.midfielders,
        forwards: this.players.forwards
    };
};

// Instance method to check if player exists
teamSchema.methods.hasPlayer = function(playerName) {
    const allPlayers = [
        this.players.goalkeeper,
        ...this.players.defenders,
        ...this.players.midfielders,
        ...this.players.forwards
    ];
    return allPlayers.includes(playerName);
};

// Static method to find teams by formation
teamSchema.statics.findByFormation = function(formation) {
    return this.find({ formation });
};

// Static method to find teams with player
teamSchema.statics.findByPlayer = function(playerName) {
    return this.find({
        $or: [
            { 'players.goalkeeper': playerName },
            { 'players.defenders': playerName },
            { 'players.midfielders': playerName },
            { 'players.forwards': playerName }
        ]
    });
};

// Update the updatedAt field before saving
teamSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes
teamSchema.index({ name: 1 });
teamSchema.index({ createdAt: -1 });
teamSchema.index({ 'players.goalkeeper': 1 });
teamSchema.index({ 'players.defenders': 1 });
teamSchema.index({ 'players.midfielders': 1 });
teamSchema.index({ 'players.forwards': 1 });

const Team = mongoose.model('Team', teamSchema);

export default Team; 