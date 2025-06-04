class User < ApplicationRecord
  has_secure_password

  validates :full_name, :email, :cellphone, :address, :nationality, :document, :role, presence: true
  validates :email, uniqueness: true
end