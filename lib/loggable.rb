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

# For converting an object that doesn't have a very helpful #to_s method--and thus doesn't produce
# helpful information when logged--into a more loggable format.
module Loggable
  # Converts a class instance into a hash for better logging. The method has this awkward name to
  # avoid name conflicts.
  # @param [Array] already_hashed The instance variables for the class instance that have already
  #   been converted to hashes with this method. Necessary to avoid circular dependencies
  def to_loggable_hash(already_hashed = [])
    # To prevent circular references
    return "Circular reference detected" if already_hashed.include?(self)
    already_hashed.push(self)
    instance_variables.each_with_object({}) do |var, hash|
      value = instance_variable_get(var)
      key = var.to_s.delete("@")
      hash[key] =
        if value.respond_to?(:to_loggable_hash) && already_hashed.exclude?(value)
          value.to_loggable_hash(already_hashed)
        else
          value
        end
    end
  end
end
