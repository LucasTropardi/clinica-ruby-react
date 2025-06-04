class UsersController < ApplicationController
  def create
    user = User.new(user_params)
    user.role = "paciente"  # Default role for new users

    if user.save
      token = JsonWebToken.encode(user_id: user.id, role: user.role)
      render json: { token: token, role: user.role }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:full_name, :email, :password, :cellphone, :address, :nationality, :document)
  end
end
