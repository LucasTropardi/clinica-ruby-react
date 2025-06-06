class AppointmentsController < ApplicationController
  before_action :set_appointment, only: [:show, :destroy]
  before_action :check_ownership, only: [:show, :destroy]

  def all
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

  def by_doctor
    doctor_id = params[:doctor_id]
    date = params[:date]

    unless doctor_id.present? && date.present?
      return render json: { error: 'doctor_id and date are required' }, status: :bad_request
    end

    appointments = Appointment
      .where(doctor_id: doctor_id, date: date, status: "active")
      .select(:time)

    render json: appointments
  end

  def available_times
    doctor = Doctor.find_by(id: params[:id])
    date = params[:date]

    if doctor.nil?
      return render json: { error: 'Doctor not found' }, status: :not_found
    end

    if date.blank?
      return render json: { error: 'Date is required' }, status: :bad_request
    end

    begin
      date_obj = Date.parse(date)
    rescue ArgumentError
      return render json: { error: 'Invalid date format' }, status: :unprocessable_entity
    end

    weekday = date_obj.strftime('%A').downcase

    unless doctor.available_days.include?(weekday)
      return render json: [] # Médico não atende nesse dia
    end

    # Horários padrão: 08:00–11:30 e 14:00–17:30 (intervalo de 30min)
    slots = (8..11).to_a.concat((14..17).to_a).flat_map do |hour|
      ["#{format('%02d', hour)}:00", "#{format('%02d', hour)}:30"]
    end

    # Horários já ocupados pelo médico (convertidos para string 'HH:MM')
    taken = Appointment
              .where(doctor_id: doctor.id, date: date)
              .pluck(Arel.sql("to_char(time, 'HH24:MI')"))

    # Subtrai os ocupados dos possíveis
    available = slots - taken

    render json: available
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
