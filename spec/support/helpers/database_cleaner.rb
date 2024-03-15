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

# TODO: Add doc
module DatabaseCleaner
  extend self

  PERSISTED_TABLES = ["ar_internal_metadata", "schema_migrations"].freeze

  def truncate_tables(excluded_tables = [])
    final_excluded_tables = Set.new([*excluded_tables, *PERSISTED_TABLES])
    ActiveRecord::Base.connection.tables.each do |table|
      next if final_excluded_tables.include?(table)
      ActiveRecord::Base.connection.execute("TRUNCATE TABLE #{table} RESTART IDENTITY CASCADE")
    end
  end

  def truncate_only(to_truncate)
    ActiveRecord::Base.connection.tables.each do |table|
      next unless to_truncate.include?(table)
      ActiveRecord::Base.connection.execute("TRUNCATE TABLE #{table} RESTART IDENTITY CASCADE")
    end
  end
end
