# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# Module for converting a class instance into a hash for better logging.
module Hashable
  # Unique name to avoid name conflicts
  def to_log_hash(already_hashed = [])
    # To prevent circular references
    return "Circular reference detected" if already_hashed.include?(self)
    already_hashed.push(self)
    instance_variables.each_with_object({}) do |var, hash|
      value = instance_variable_get(var)
      key = var.to_s.delete("@")
      hash[key] = if value.respond_to?(:to_log_hash) && already_hashed.exclude?(value)
                    value.to_log_hash(already_hashed)
                  else
                    value
                  end
    end
  end
end
