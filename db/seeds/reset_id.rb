# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

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
