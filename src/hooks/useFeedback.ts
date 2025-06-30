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
    console.log('Submitting feedback:', feedbackData);
    
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Explicitly set the method to POST
      method: 'POST',
      // Add timeout
      timeout: 10000,
    });

    console.log('Feedback response:', response);

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
      // Handle specific CORS/OPTIONS errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        return {
          success: false,
          message: 'Network error: Please check your connection and try again.',
        };
      }
      
      // Handle 405 Method Not Allowed specifically
      if (error.response?.status === 405) {
        return {
          success: false,
          message: 'Server configuration error: Method not allowed. Please contact support.',
        };
      }
      
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