class AppointmentsController < ApplicationController
  before_action :set_appointment, only: [:show, :destroy]
  before_action :check_ownership, only: [:show, :destroy]

  def all
    unless current_user.role == 'admin'
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    appointments = Appointment.all
    render json: appointments
  end

  def index
    appointments = current_user.appointments.where(status: "active")
    render json: appointments
  end

  def show
    render json: @appointment
  end

  def create
    appointment = current_user.appointments.build(appointment_params)
    appointment.status = "active"

    if appointment_invalid?(appointment)
      return
    end

    if appointment.save
      render json: appointment, status: :created
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    datetime = DateTime.parse("#{@appointment.date} #{@appointment.time}")
    if datetime < 1.day.from_now
      render json: { error: 'Only cancellations with 1 day notice are allowed' }, status: :forbidden
    else
      @appointment.destroy
      head :no_content
    end
  end

  private

  def set_appointment
    @appointment = Appointment.find(params[:id])
  end

  def check_ownership
    render json: { error: 'Forbidden' }, status: :forbidden unless @appointment.user_id == current_user.id
  end

  def appointment_params
    params.require(:appointment).permit(:doctor_id, :date, :time)
  end

  def appointment_invalid?(appointment)
    datetime = DateTime.parse("#{appointment.date} #{appointment.time}")

    # Fora do horário permitido
    unless valid_schedule_time?(datetime)
      render json: { error: 'Appointment must be on weekdays between 08:00–12:00 or 14:00–18:00' }, status: :unprocessable_entity
      return true
    end

    # Médico já tem consulta no horário
    if Appointment.exists?(doctor_id: appointment.doctor_id, date: appointment.date, time: appointment.time, status: "active")
      render json: { error: 'Doctor already has an appointment at this time' }, status: :conflict
      return true
    end

    # Usuário já tem consulta no horário
    if Appointment.exists?(user_id: current_user.id, date: appointment.date, time: appointment.time, status: "active")
      render json: { error: 'You already have an appointment at this time' }, status: :conflict
      return true
    end

    false
  end

  def valid_schedule_time?(datetime)
    weekday = datetime.on_weekday? # Rails 8
    hour = datetime.hour
    weekday && ((8..11).include?(hour) || (14..17).include?(hour))
  end
end
