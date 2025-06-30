import axios from 'axios';

const API_BASE_URL = "https://api.videoindex.app";

export interface FeedbackData {
  name?: string;
  email?: string;
  rating: number;
  category: string;
  comments: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  id?: string;
}

export const submitFeedback = async (feedbackData: FeedbackData): Promise<FeedbackResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: response.data.message || 'Feedback submitted successfully',
        id: response.data.id,
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      return {
        success: false,
        message: `Failed to submit feedback: ${errorMessage}`,
      };
    }
    
    return {
      success: false,
      message: 'Failed to submit feedback. Please try again.',
    };
  }
};