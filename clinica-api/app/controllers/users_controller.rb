class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  before_action :check_admin, only: [:index, :destroy]
  before_action :check_self_or_admin, only: [:show, :update]

  def create
    user = User.new(user_params)
    user.role = "paciente"  # Default role for new users

    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    users = User.all
    render json: users
  end

  def show
    render json: @user
  end

  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def check_admin
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_user.role == 'admin'
  end

  def check_self_or_admin
    unless @current_user.role == 'admin' || @current_user.id == @user.id
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def user_params
    params.permit(:full_name, :email, :password, :cellphone, :address, :nationality, :document)
  end
end
