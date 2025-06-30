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
    
    // Ensure knowledge_base_id is a string and not undefined
    const payload = {
      knowledge_base_id: String(feedbackData.knowledge_base_id),
      query: feedbackData.query,
      response: feedbackData.response,
      thumbs_up: feedbackData.thumbs_up,
      // Only include comments if it exists and is not empty
      ...(feedbackData.comments && feedbackData.comments.trim() && { comments: feedbackData.comments.trim() })
    };
    
    console.log('Final payload being sent:', payload);
    
    const response = await axios.post(`${API_BASE_URL}/query-feedback`, payload, {
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
      // Log the full error response for debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      
      // Handle specific CORS/OPTIONS errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        return {
          success: false,
          message: 'Network error: Please check your connection and try again.',
        };
      }
      
      // Handle 422 Unprocessable Entity specifically
      if (error.response?.status === 422) {
        const errorDetails = error.response.data?.detail || error.response.data?.message || 'Invalid data format';
        console.error('422 Error details:', errorDetails);
        return {
          success: false,
          message: `Data validation error: ${errorDetails}`,
        };
      }
      
      // Handle 405 Method Not Allowed specifically
      if (error.response?.status === 405) {
        return {
          success: false,
          message: 'Server configuration error: Method not allowed. Please contact support.',
        };
      }
      
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message;
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