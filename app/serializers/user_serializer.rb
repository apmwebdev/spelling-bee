class UserSerializer
  include JSONAPI::Serializer
  attributes :email, :name, :username
end
