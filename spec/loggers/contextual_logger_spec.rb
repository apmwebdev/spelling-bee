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

require "rails_helper"


RSpec.describe ContextualLogger do
  log_path = Rails.root.join("spec", "test_logs", "test.log")
  subject(:logger) { described_class.new(log_path) }

  before(:each) do
    # Make sure the path to the test logs directory exists
    FileUtils.mkdir_p(File.dirname(log_path))
    # Erase the contents of the test log file between each test
    File.open(log_path, "w") {}
  end

  after(:all) do
    # Delete the test log file after a test run
    File.delete(log_path) if File.exist?(log_path)
  end

  describe "#debug" do
    # stuff
  end

  describe "valid_puts_global?" do
    it "returns true when passed a boolean", :aggregate_failures do
      expect(logger.send(:valid_puts_global?, true)).to be(true)
      expect(logger.send(:valid_puts_global?, false)).to be(true)
    end
  end
end
