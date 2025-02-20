import mongoose from 'mongoose';

const seanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Pour optimiser les recherches par userId
  },
  userEmail: {
    type: String,
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  dateReservation: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['payée', 'annulée'],
    default: 'payée'
  },
  montantPayé: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index composé pour optimiser les recherches par utilisateur et activité
seanceSchema.index({ userId: 1, activityId: 1 });

export const Seance = mongoose.model('Seance', seanceSchema);
