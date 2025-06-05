class User < ApplicationRecord
  has_secure_password

  has_many :appointments

  validates :full_name, :email, :cellphone, :address, :nationality, :document, :role, presence: true
  validates :email, uniqueness: true
end