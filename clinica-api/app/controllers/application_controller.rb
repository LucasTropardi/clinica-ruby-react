class ApplicationController < ActionController::API
  attr_reader :current_user
  
  before_action :authorize_request

  private

  def authorize_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue
    render json: { errors: ['Unauthorized'] }, status: :unauthorized
  end
end
