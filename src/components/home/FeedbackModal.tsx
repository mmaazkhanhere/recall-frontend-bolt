import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitFeedback, FeedbackData } from '../../hooks/useFeedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: '',
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const categories = [
    'User Interface',
    'Performance',
    'Features',
    'Search Functionality',
    'Video Player',
    'Overall Experience',
    'Bug Report',
    'Feature Request'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous submit status when user starts editing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    // Clear any previous submit status when user changes rating
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const validateForm = (): string | null => {
    if (formData.rating === 0) {
      return 'Please provide a rating';
    }
    if (!formData.category.trim()) {
      return 'Please select a category';
    }
    if (!formData.feedback.trim()) {
      return 'Please provide your feedback';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({
        type: 'error',
        message: validationError
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const feedbackData: FeedbackData = {
        rating: formData.rating,
        category: formData.category,
        feedback: formData.feedback,
        // Only include name and email if they have values
        ...(formData.name.trim() && { name: formData.name.trim() }),
        ...(formData.email.trim() && { email: formData.email.trim() }),
      };

      const response = await submitFeedback(feedbackData);
      
      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: response.message
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            rating: 0,
            category: '',
            feedback: ''
          });
          setSubmitStatus({ type: null, message: '' });
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.message
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Share Your Feedback</h2>
                  <p className="text-sm text-muted-foreground">
                    Help us improve VideoIndex with your thoughts and suggestions
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Status Message */}
            <AnimatePresence>
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{submitStatus.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Rating - Required */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRatingClick(star)}
                      disabled={isSubmitting}
                      className={`p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        star <= formData.rating
                          ? 'text-yellow-500'
                          : 'text-muted-foreground hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                    </motion.button>
                  ))}
                  <span className="ml-3 text-sm text-muted-foreground">
                    {formData.rating > 0 && (
                      <>
                        {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                        {formData.rating === 5 && ' - Excellent!'}
                        {formData.rating === 4 && ' - Very Good'}
                        {formData.rating === 3 && ' - Good'}
                        {formData.rating === 2 && ' - Fair'}
                        {formData.rating === 1 && ' - Poor'}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Category - Required */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Feedback Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Feedback - Required */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-foreground mb-2">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell us about your experience with VideoIndex. What did you like? What could be improved? Any specific features or improvements you'd like to see?"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || submitStatus.type === 'success'}
                  className="inline-flex items-center px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"></div>
                      Submitting...
                    </>
                  ) : submitStatus.type === 'success' ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submitted!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;