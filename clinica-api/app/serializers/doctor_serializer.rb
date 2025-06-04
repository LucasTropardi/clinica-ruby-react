class DoctorSerializer < ActiveModel::Serializer
  attributes :id, :name, :specialty, :crm, :available_days

  def available_days
    object.available_days&.split(',') || []
  end
end
