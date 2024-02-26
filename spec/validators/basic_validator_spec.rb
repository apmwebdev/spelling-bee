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

# NOTE: The tests in this spec must be run in order
RSpec.describe BasicValidator do
  before(:all) do
    @logger = ContextualLogger.new(global_puts_only: true)
  end

  describe "#valid_type?" do
    before(:all) do
      @helper = BasicValidatorHelper.new(logger: @logger)
    end

    describe "Argument Validation" do
      context "validating classes with no @logger instance variable defined" do
        before(:each) do
          @no_logger = BasicValidatorHelper::NoLogger.new
        end

        it "doesn't raise an error if logger_override is passed in" do
          expect do
            @no_logger.valid_type?("foo", String, should_raise: true, logger_override: @logger)
          end.not_to raise_error
        end

        it "raises an ArgumentError if no logger_override is input, regardless of should_raise" do
          expect { @no_logger.valid_type?("foo", String, should_raise: false) }.to(
            raise_error(ArgumentError),
          )
        end
      end

      context "validating @logger and logger_override" do
        before(:each) do
          # The method should still raise exceptions for invalid arguments, even with
          # should_raise set to false.
          @helper.reset_all(should_raise: false)
        end

        it "raises an ArgumentError when @logger is nil and no logger_override is passed in" do
          expect { @helper.valid_type?("foo", String) }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError when @logger is nil and logger_override is invalid",
          :aggregate_failures do
          @helper.logger_override = Logger.new($stdout)
          expect { @helper.run({}, Hash) }.to raise_error(ArgumentError)
          @helper.logger_override = "some random value"
          expect { @helper.run([], Array) }.to raise_error(ArgumentError)
        end

        it "raises a TypeError when both @logger and logger_override are invalid" do
          @helper.reset_all(logger: Logger.new($stdout), logger_override: Logger.new($stdout))
          expect { @helper.run(Set.new, Set) }.to raise_error(ArgumentError)
        end

        it "raises a TypeError when @logger is invalid and no logger_override is provided" do
          expect { @helper.run({}, Hash) }.to raise_error(ArgumentError)
        end

        it "does not raise an exception if @logger is valid and no logger_override is present" do
          @helper.logger = @logger
          expect { @helper.valid_type?("foo", String) }.not_to raise_error
        end

        it "does not raise an exception if logger_override is valid and no @logger is present" do
          @helper.logger_override = @logger
          expect { @helper.run(123, Integer) }.not_to raise_error
        end
      end

      context "validating type argument" do
        before(:all) do
          @helper.reset_all(should_raise: false, logger: @logger)
        end

        it "raises an ArgumentError if type is an empty array" do
          @helper.type = []
          expect { @helper.run([]) }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError if type is an array and contains non-Class objects" do
          @helper.type = [Integer, "String"]
          expect { @helper.run(123) }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError if type isn't a class or array", :aggregate_failures do
          @helper.type = "String"
          expect { @helper.run("food") }.to raise_error(ArgumentError)
          @helper.type = nil
          expect { @helper.run(nil) }.to raise_error(ArgumentError)
          @helper.type = 123
          expect { @helper.run(123) }.to raise_error(ArgumentError)
        end

        it "doesn't raise an exception if type is a class" do
          @helper.type = String
          expect { @helper.run("foo") }.not_to raise_error
        end

        it "doesn't raise an exception if type is an array of classes" do
          @helper.type = [Integer, String]
          expect { @helper.run(333) }.not_to raise_error
        end
      end

      context "validating validation_fn" do
        before(:all) do
          @helper.reset_all(value: "foo", type: String, should_raise: true, logger: @logger)
        end

        it "raises an ArgumentError if validation_fn is a non-lambda Proc" do
          @helper.validation_fn = proc { true }
          expect { @helper.run }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError if validation_fn is a lambda but has an arity other than 1",
          :aggregate_failures do
          @helper.validation_fn = -> { true }
          expect { @helper.run }.to raise_error(ArgumentError)
          @helper.validation_fn = ->(*args) { [*args] }
          expect { @helper.run }.to raise_error(ArgumentError)
          @helper.validation_fn = ->(**args) { { **args } }
          expect { @helper.run }.to raise_error(ArgumentError)
          @helper.validation_fn = ->(required, *rest) { [required, *rest] }
          expect { @helper.run }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError if validation_fn takes named arguments" do
          @helper.validation_fn = ->(arg:) { arg }
          expect { @helper.run }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError if validation_fn is not nil and not a lambda",
          :aggregate_failures do
          @helper.validation_fn = []
          expect { @helper.run }.to raise_error(ArgumentError)
          @helper.validation_fn = 123
          expect { @helper.run }.to raise_error(ArgumentError)
          @helper.validation_fn = {}
          expect { @helper.run }.to raise_error(ArgumentError)
        end

        it "doesn't raise an error if validation_fn is nil" do
          @helper.validation_fn = nil
          expect { @helper.run }.not_to raise_error
        end

        it "doesn't raise an error if validation_fn is a lambda that accepts 1 argument",
          :aggregate_failures do
          @helper.validation_fn = ->(arg) { arg }
          expect { @helper.run }.not_to raise_error
        end
      end

      # For validation of should_raise, see the tests for #validate_should_raise! and
      # #determine_v8n_exception_type!
    end

    describe "Argument Behavior" do
    end

    describe "Type Validation" do
    end
  end

  describe "#determine_logger!" do
    before(:all) do
      # No logger defined initially
      @helper = BasicValidatorHelper.new
      @instance_logger = ContextualLogger.new
      @logger_override = ContextualLogger.new
    end

    it "returns logger_override when logger_override and instance_logger are both valid" do
      expect(@helper.send(:determine_logger!, @instance_logger, @logger_override)).to(
        eq(@logger_override),
      )
    end

    it "returns logger_override when logger_override is valid and instance_logger is not",
      :aggregate_failures do
      expect(@helper.send(:determine_logger!, nil, @logger_override)).to eq(@logger_override)
      expect(@helper.send(:determine_logger!, {}, @logger_override)).to eq(@logger_override)
      expect(@helper.send(:determine_logger!, "blah", @logger_override)).to eq(@logger_override)
      expect(@helper.send(:determine_logger!, Logger.new($stdout), @logger_override)).to(
        eq(@logger_override),
      )
    end

    it "returns instance_logger when instance_logger is valid and logger_override is not",
      :aggregate_failures do
      expect(@helper.send(:determine_logger!, @instance_logger, nil)).to eq(@instance_logger)
      expect(@helper.send(:determine_logger!, @instance_logger, {})).to eq(@instance_logger)
      expect(@helper.send(:determine_logger!, @instance_logger, "blah")).to eq(@instance_logger)
      expect(@helper.send(:determine_logger!, @instance_logger, Logger.new($stdout))).to(
        eq(@instance_logger),
      )
    end

    it "raises an ArgumentError when both instance_logger and logger_override are invalid",
      :aggregate_failures do
      expect { @helper.send(:determine_logger!, nil, nil) }.to raise_error(ArgumentError)
      expect { @helper.send(:determine_logger!, {}, "blah") }.to raise_error(ArgumentError)
      expect { @helper.send(:determine_logger!, Logger.new($stdout), "blah") }.to(
        raise_error(ArgumentError),
      )
      expect { @helper.send(:determine_logger!, "blah", Logger.new($stdout)) }.to(
        raise_error(ArgumentError),
      )
    end
  end

  describe "#validate_should_raise!" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "returns true if should_raise is a boolean", :aggregate_failures do
      expect(@helper.send(:validate_should_raise!, true)).to be(true)
      expect(@helper.send(:validate_should_raise!, false)).to be(true)
    end

    it "returns true if should_raise is a class that is or inherits from StandardError",
      :aggregate_failures do
      expect(@helper.send(:validate_should_raise!, StandardError)).to be(true)
      expect(@helper.send(:validate_should_raise!, ArgumentError)).to be(true)
      expect(@helper.send(:validate_should_raise!, TypeError)).to be(true)
    end

    it "raises an ArgumentError if should_raise is an instance of StandardError rather than the class itself",
      :aggregate_failures do
      expect { @helper.send(:validate_should_raise!, StandardError.new) }.to(
        raise_error(ArgumentError),
      )
      expect { @helper.send(:validate_should_raise!, ArgumentError.new) }.to(
        raise_error(ArgumentError),
      )
      expect { @helper.send(:validate_should_raise!, TypeError.new) }.to(
        raise_error(ArgumentError),
      )
    end

    it "raises an ArgumentError if should_raise is a class that doesn't inherit from StandardError",
      :aggregate_failures do
      expect { @helper.send(:validate_should_raise!, Exception) }.to raise_error(ArgumentError)
      expect { @helper.send(:validate_should_raise!, String) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if should_raise isn't a class or a boolean", :aggregate_failures do
      expect { @helper.send(:validate_should_raise!, "foo") }.to raise_error(ArgumentError)
      expect { @helper.send(:validate_should_raise!, 123) }.to raise_error(ArgumentError)
      expect { @helper.send(:validate_should_raise!, nil) }.to raise_error(ArgumentError)
    end
  end

  describe "#determine_v8n_exception_type!" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "raises an ArgumentError if should_raise is invalid", :aggregate_failures do
      expect { @helper.send(:determine_v8n_exception_type!, nil) }.to raise_error(ArgumentError)
      expect { @helper.send(:determine_v8n_exception_type!, 123) }.to raise_error(ArgumentError)
      expect { @helper.send(:determine_v8n_exception_type!, "foo") }.to raise_error(ArgumentError)
      expect { @helper.send(:determine_v8n_exception_type!, StandardError.new) }.to(
        raise_error(ArgumentError),
      )
      expect { @helper.send(:determine_v8n_exception_type!, Exception) }.to(
        raise_error(ArgumentError),
      )
    end

    it "returns should_raise if should_raise is a class that inherits from StandardError",
      :aggregate_failures do
      expect(@helper.send(:determine_v8n_exception_type!, StandardError)).to be(StandardError)
      expect(@helper.send(:determine_v8n_exception_type!, ArgumentError)).to be(ArgumentError)
      expect(@helper.send(:determine_v8n_exception_type!, TypeError)).to be(TypeError)
    end

    it "returns TypeError if should_raise is a boolean" do
      expect(@helper.send(:determine_v8n_exception_type!, true)).to be(TypeError)
      expect(@helper.send(:determine_v8n_exception_type!, false)).to be(TypeError)
    end
  end

  describe "#compose_failed_v8n_message" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "returns a properly formatted message" do
      value = "foo"
      type = Integer
      display_name = "test_value"
      expected_result = "test_value must be a(n) Integer but is a String: foo"
      expect(@helper.send(:compose_failed_v8n_message, value, type, display_name)).to(
        eq(expected_result),
      )
    end
  end

  describe "#compose_type_string" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "returns the string if passed a string", :aggregate_failures do
      type_string_a = "Boolean"
      expect(@helper.send(:compose_type_string, type_string_a)).to eq(type_string_a)

      type_string_b = "String or #to_s"
      expect(@helper.send(:compose_type_string, type_string_b)).to eq(type_string_b)
    end

    it "returns the class's name if passed a single class" do
      single_class = String
      expected_response = "String"
      expect(@helper.send(:compose_type_string, single_class)).to eq(expected_response)
    end

    it "returns the first class's name if passed an array of a single class" do
      type_array = [Integer]
      expected_response = "Integer"
      expect(@helper.send(:compose_type_string, type_array)).to eq(expected_response)
    end

    it "returns a string of the two class names separated by 'or' when passed an array of two classes" do
      type_array = [String, Integer]
      expected_response = "String or Integer"
      expect(@helper.send(:compose_type_string, type_array)).to eq(expected_response)
    end

    it "returns a comma-separated list of class names with 'or' before the last one when passed an array of 3+ classes",
      :aggregate_failures do
      three_types = [String, Integer, Hash]
      expected_3_types_string = "String, Integer, or Hash"
      expect(@helper.send(:compose_type_string, three_types)).to eq(expected_3_types_string)

      four_types = [Set, Float, Array, Exception]
      expected_4_types_string = "Set, Float, Array, or Exception"
      expect(@helper.send(:compose_type_string, four_types)).to eq(expected_4_types_string)
    end

    it "raises a TypeError when passed anything other than a class or array of classes",
      :aggregate_failures do
      expect { @helper.send(:compose_type_string, nil) }.to raise_error(TypeError)
      expect { @helper.send(:compose_type_string, []) }.to raise_error(TypeError)
      expect { @helper.send(:compose_type_string, []) }.to raise_error(TypeError)
    end
  end
end
