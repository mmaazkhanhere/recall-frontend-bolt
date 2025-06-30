import axios from 'axios';

const API_BASE_URL = "https://api.videoindex.app";

export interface QueryFeedbackData {
  knowledge_base_id: string;
  query: string;
  response: string;
  thumbs_up: boolean;
  comments?: string;
}

export interface QueryFeedbackResponse {
  success: boolean;
  message: string;
  id?: string;
}

export const submitQueryFeedback = async (feedbackData: QueryFeedbackData): Promise<QueryFeedbackResponse> => {
  try {
    console.log('Submitting query feedback:', feedbackData);
    
    const response = await axios.post(`${API_BASE_URL}/query-feedback`, feedbackData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    console.log('Query feedback response:', response);

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
    console.error('Error submitting query feedback:', error);
    
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