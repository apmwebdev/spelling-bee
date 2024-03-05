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

RSpec.shared_context "openai_bypass_logger" do
  let(:word_limit) { 20 }
  let(:logger) { instance_double(ContextualLogger).as_null_object }
  let(:validator) { instance_double(OpenaiApiService::Validator).as_null_object }
  let(:service) { OpenaiApiService.new(logger:, validator:) }
end
