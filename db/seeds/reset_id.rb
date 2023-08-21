# frozen_string_literal: true

module ResetId
  def self.reset(*to_reset)
    to_reset.each do |item_to_reset|
      if item_to_reset.is_a?(String)
        ActiveRecord::Base.connection.reset_pk_sequence!(item_to_reset)
      elsif item_to_reset < ActiveRecord::Base
        ActiveRecord::Base.connection.reset_pk_sequence!(item_to_reset.table_name)
      else
        raise ArgumentError.new "Argument must be a table name or Active Record class"
      end
    end
  end

  def self.reset_all
    ActiveRecord::Base.connection.tables.each do |t|
      ActiveRecord::Base.connection.reset_pk_sequence!(t)
    end
  end
end
