class DoctorsController < ApplicationController
  skip_before_action :authorize_request, only: [:index, :show]
  before_action :check_admin, only: [:create, :update, :destroy]
  before_action :set_doctor, only: [:show, :update, :destroy]

  def index
    doctors = Doctor.all
    render json: doctors, each_serializer: DoctorSerializer
  end

  def show
    render json: @doctor, serializer: DoctorSerializer
  end

  def create
    doctor = Doctor.new(doctor_params)
    if doctor.save
      render json: doctor, serializer: DoctorSerializer, status: :created
    else
      render json: { errors: doctor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @doctor.update(doctor_params)
      render json: @doctor, serializer: DoctorSerializer
    else
      render json: { errors: @doctor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @doctor.destroy
    head :no_content
  end

  private

  def set_doctor
    @doctor = Doctor.find(params[:id])
  end

  def doctor_params
    params.permit(:name, :specialty, :crm, available_days: [])
  end

  def check_admin
    render json: { error: 'Forbidden' }, status: :forbidden unless current_user&.role == 'admin'
  end
end
