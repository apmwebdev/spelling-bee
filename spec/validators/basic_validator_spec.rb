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

RSpec.describe BasicValidator do
  before(:all) do
    @logger = ContextualLogger.new(IO::NULL, global_puts_and: false)
  end

  describe "#valid_type?, #valid_type!, and #validate_type" do
    before(:all) do
      @helper = BasicValidatorHelper.new(logger: @logger)
    end

    describe "Argument Validation" do
      context "validating classes with no @logger instance variable defined" do
        let(:no_logger) { BasicValidatorHelper::NoLogger.new }

        it "doesn't raise an error if logger_override is passed in" do
          expect do
            no_logger.valid_type?("foo", String, logger_override: @logger)
          end.not_to raise_error
          expect do
            no_logger.valid_type!("foo", String, logger_override: @logger)
          end.not_to raise_error
        end

        it "raises an ArgumentError if no logger_override is input, regardless of should_raise" do
          expect { no_logger.valid_type?("foo", String) }
            .to raise_error(ArgumentError)
          expect { no_logger.valid_type!("foo", String) }
            .to raise_error(ArgumentError)
        end
      end

      context "validating @logger and logger_override" do
        before(:each) do
          # The method should still raise exceptions for invalid arguments, even with
          # should_raise set to false.
          @helper.reset_all(value: "foo", type: String, logger: nil)
        end

        it "raises an ArgumentError when @logger is nil and no logger_override is passed in" do
          expect { @helper.run(logger_override: :exclude) }.to raise_error(ArgumentError)
          expect { @helper.run!(logger_override: :exclude) }.to raise_error(ArgumentError)
        end

        it "raises an ArgumentError when @logger is nil and logger_override is invalid",
          :aggregate_failures do
          @helper.logger_override = Logger.new($stdout)
          expect { @helper.run }.to raise_error(ArgumentError)
          expect { @helper.run! }.to raise_error(ArgumentError)
          @helper.logger_override = "some random value"
          expect { @helper.run }.to raise_error(ArgumentError)
          expect { @helper.run! }.to raise_error(ArgumentError)
        end

        it "raises a TypeError when both @logger and logger_override are invalid" do
          @helper.reset_all(logger: Logger.new($stdout), logger_override: Logger.new($stdout))
          expect { @helper.run }.to raise_error(ArgumentError)
          expect { @helper.run! }.to raise_error(ArgumentError)
        end

        it "raises a TypeError when @logger is invalid and no logger_override is provided" do
          @helper.logger = "blah"
          expect { @helper.run(logger_override: :exclude) }.to raise_error(ArgumentError)
          expect { @helper.run!(logger_override: :exclude) }.to raise_error(ArgumentError)
        end

        it "does not raise an exception if @logger is valid and no logger_override is provided" do
          @helper.logger = @logger
          expect { @helper.run(logger_override: :exclude) }.not_to raise_error
          expect { @helper.run!(logger_override: :exclude) }.not_to raise_error
        end

        it "does not raise an exception if logger_override is valid and @logger is nil" do
          @helper.logger_override = @logger
          expect { @helper.run }.not_to raise_error
          expect { @helper.run! }.not_to raise_error
        end
      end

      context "validating type argument" do
        # For full validation, see the tests for #valid_asserted_type!
        before(:all) do
          @helper.reset_all(value: "foo", logger: @logger)
        end

        it "raises an ArgumentError if type is invalid", :aggregate_failures do
          @helper.type = nil
          expect { @helper.run }.to raise_error(ArgumentError)
          expect { @helper.run! }.to raise_error(ArgumentError)
        end

        it "doesn't raise an exception if type is a class" do
          @helper.type = String
          expect { @helper.run }.not_to raise_error
          expect { @helper.run! }.not_to raise_error
        end
      end

      context "validating validation_fn" do
        # For full validation, see the tests for #valid_validation_fn!
        before(:all) do
          @helper.reset_all(value: "foo", type: String, logger: @logger)
        end

        it "raises an ArgumentError if validation_fn is invalid" do
          @helper.validation_fn = proc { true }
          expect { @helper.run }.to raise_error(ArgumentError)
          expect { @helper.run! }.to raise_error(ArgumentError)
        end

        it "doesn't raise an error if validation_fn is nil" do
          @helper.validation_fn = nil
          expect { @helper.run }.not_to raise_error
          expect { @helper.run! }.not_to raise_error
        end

        it "doesn't raise an error if validation_fn is a lambda that accepts 1 argument",
          :aggregate_failures do
          @helper.validation_fn = ->(arg) { arg }
          expect { @helper.run }.not_to raise_error
          expect { @helper.run! }.not_to raise_error
        end
      end
    end

    describe "Type Validation" do
      before(:each) do
        @helper.reset_all(logger: @logger)
      end

      context "when type is a single class" do
        it "returns true when value is an instance of type", :aggregate_failures do
          expect(@helper.valid_type?(123, Integer)).to be(true)
          expect(@helper.valid_type!(123, Integer)).to be(true)
          expect(@helper.valid_type?("foo", String)).to be(true)
          expect(@helper.valid_type!("foo", String)).to be(true)
          expect(@helper.valid_type?({}, Hash)).to be(true)
          expect(@helper.valid_type!({}, Hash)).to be(true)
          expect(@helper.valid_type?([], Array)).to be(true)
          expect(@helper.valid_type!([], Array)).to be(true)
          expect(@helper.valid_type?(String, Class)).to be(true)
          expect(@helper.valid_type!(String, Class)).to be(true)
        end

        it "returns true when value is an instance of a class that inherits from type" do
          expect(@helper.valid_type?(TypeError.new, StandardError)).to be(true)
          expect(@helper.valid_type!(TypeError.new, StandardError)).to be(true)
          expect(@helper.valid_type?(ContextualLogger.new, Logger)).to be(true)
          expect(@helper.valid_type!(ContextualLogger.new, Logger)).to be(true)
          expect(@helper.valid_type?(123, Numeric)).to be(true)
          expect(@helper.valid_type!(123, Numeric)).to be(true)
        end

        it "fails when value is not an instance of type or its parents" do
          expect(@helper.valid_type?("foo", Integer)).to be(false)
          expect { @helper.valid_type!("foo", Integer) }.to raise_error(TypeError)
          expect(@helper.valid_type?(123, String)).to be(false)
          expect { @helper.valid_type!(123, String) }.to raise_error(TypeError)
        end

        it "fails when value is an instance of an ancestor of type" do
          expect(@helper.valid_type?(Object.new, Integer)).to be(false)
          expect { @helper.valid_type!(Object.new, Integer) }.to raise_error(TypeError)
        end

        it "fails when value is type rather than an instance of type and type != Class" do
          expect(@helper.valid_type?(String, String)).to be(false)
          expect { @helper.valid_type!(String, String) }.to raise_error(TypeError)
        end
      end

      context "when type is a single module" do
        it "returns true when value is an instance of a class that includes type" do
          expect(@helper.valid_type?([], Enumerable)).to be(true)
          expect(@helper.valid_type!([], Enumerable)).to be(true)
          expect(@helper.valid_type?(Time.new, Comparable)).to be(true)
          expect(@helper.valid_type!(Time.new, Comparable)).to be(true)
        end

        it "fails when value is not an instance of a class that includes type" do
          expect(@helper.valid_type?([], Comparable)).to be(false)
          expect { @helper.valid_type!([], Comparable) }.to raise_error(TypeError)
          expect(@helper.valid_type?("foo", Enumerable)).to be(false)
          expect { @helper.valid_type!("foo", Enumerable) }.to raise_error(TypeError)
        end

        it "fails when value is the class that includes type rather than an instance of that class" do
          expect(@helper.valid_type?(Array, Enumerable)).to be(false)
          expect { @helper.valid_type!(Array, Enumerable) }.to raise_error(TypeError)
          expect(@helper.valid_type?(Time, Comparable)).to be(false)
          expect { @helper.valid_type!(Time, Comparable) }.to raise_error(TypeError)
        end
      end

      context "when type is an array of classes" do
        it "returns true when value is an instance of one of the classes in type",
          :aggregate_failures do
          @helper.type = [String]
          expect(@helper.run("foo")).to be(true)
          expect(@helper.run!("foo")).to be(true)

          @helper.type = [String, Integer]
          expect(@helper.run("foo")).to be(true)
          expect(@helper.run!("foo")).to be(true)
          expect(@helper.run(123)).to be(true)
          expect(@helper.run!(123)).to be(true)

          @helper.type = [Hash, Array, Logger, Time]
          expect(@helper.run({})).to be(true)
          expect(@helper.run!({})).to be(true)
          expect(@helper.run([])).to be(true)
          expect(@helper.run!([])).to be(true)
        end

        it "fails when value is not an instance of one of the classes in type",
          :aggregate_failures do
          @helper.type = [String]
          expect(@helper.run([])).to be(false)
          expect { @helper.run!([]) }.to raise_error(TypeError)

          @helper.type = [String, Integer]
          expect(@helper.run([])).to be(false)
          expect { @helper.run!([]) }.to raise_error(TypeError)
          expect(@helper.run({})).to be(false)
          expect { @helper.run!({}) }.to raise_error(TypeError)

          @helper.type = [Hash, Array, Logger, Time]
          expect(@helper.run("foo")).to be(false)
          expect { @helper.run!("foo") }.to raise_error(TypeError)
          expect(@helper.run(123)).to be(false)
          expect { @helper.run!(123) }.to raise_error(TypeError)
        end
      end

      context "when type is an array of modules" do
        it "returns true when value is an instance of a class that includes one of the modules in type",
          :aggregate_failures do
          @helper.type = [Enumerable]
          expect(@helper.run([])).to be(true)
          expect(@helper.run!([])).to be(true)

          @helper.type = [Enumerable, Comparable]
          expect(@helper.run([])).to be(true)
          expect(@helper.run!([])).to be(true)
          expect(@helper.run(Time.new)).to be(true)
          expect(@helper.run!(Time.new)).to be(true)
        end

        it "fails when value is not an instance of a class that includes one of the modules in type" do
          @helper.type = [Enumerable]
          expect(@helper.run("foo")).to be(false)
          expect { @helper.run!("foo") }.to raise_error(TypeError)
          expect(@helper.run(:foo)).to be(false)
          expect { @helper.run!(:foo) }.to raise_error(TypeError)

          @helper.type = [Enumerable, Marshal]
          expect(@helper.run("foo")).to be(false)
          expect { @helper.run!("foo") }.to raise_error(TypeError)
          expect(@helper.run(:foo)).to be(false)
          expect { @helper.run!(:foo) }.to raise_error(TypeError)
        end
      end

      context "when type is an array of classes and modules" do
        it "returns true when value.is_a? returns true for at least one item in the array" do
          @helper.type = [Enumerable, String]
          expect(@helper.run("foo")).to be(true)
          expect(@helper.run!("foo")).to be(true)
          expect(@helper.run([])).to be(true)
          expect(@helper.run!([])).to be(true)
        end

        it "returns true when value.is_a? returns true for all items in the array" do
          @helper.type = [Comparable, String]
          expect(@helper.run("foo")).to be(true)
          expect(@helper.run!("foo")).to be(true)
        end
      end
    end

    describe "#valid_type?" do
      it "returns false when validation fails" do
        expect(@helper.valid_type?("foo", Integer)).to be(false)
      end

      it "does not raise an exception when validation fails" do
        expect { @helper.valid_type?("foo", Integer) }.not_to raise_error
      end
    end

    describe "#valid_type!" do
      it "raises a TypeError if validation fails and error_class is not provided" do
        expect { @helper.valid_type!("foo", Integer) }.to raise_error(TypeError)
      end

      it "raises error_class if a valid one is provided" do
        error_class = ArgumentError
        expect { @helper.valid_type!("foo", Integer, error_class:) }.to raise_error(error_class)
      end
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

  describe "#valid_asserted_type!" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "raises an ArgumentError if type is an empty array" do
      expect { @helper.send(:valid_asserted_type!, []) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if type is an array and contains non-Class objects" do
      type = [Integer, "String"]
      expect { @helper.send(:valid_asserted_type!, type) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if type isn't a class or array", :aggregate_failures do
      expect { @helper.send(:valid_asserted_type!, "String") }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_asserted_type!, nil) }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_asserted_type!, 123) }.to raise_error(ArgumentError)
    end

    it "doesn't raise an exception if type is a class" do
      expect { @helper.send(:valid_asserted_type!, String) }.not_to raise_error
    end

    it "doesn't raise an exception if type is an array of classes" do
      expect { @helper.send(:valid_asserted_type!, [Integer, String]) }.not_to raise_error
    end
  end

  describe "#valid_validation_fn!" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "raises an ArgumentError if validation_fn is a non-lambda Proc" do
      validation_fn = proc { true }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if validation_fn is a lambda but has an arity other than 1",
      :aggregate_failures do
      validation_fn = -> { true }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.to raise_error(ArgumentError)
      validation_fn = ->(*args) { [*args] }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.to raise_error(ArgumentError)
      validation_fn = ->(**args) { { **args } }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.to raise_error(ArgumentError)
      validation_fn = ->(required, *rest) { [required, *rest] }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if validation_fn takes named arguments" do
      validation_fn = ->(arg:) { arg }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if validation_fn is not nil and not a lambda",
      :aggregate_failures do
      expect { @helper.send(:valid_validation_fn!, []) }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_validation_fn!, 123) }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_validation_fn!, {}) }.to raise_error(ArgumentError)
    end

    it "returns true and doesn't raise an error if validation_fn is nil" do
      expect { @helper.send(:valid_validation_fn!, nil) }.not_to raise_error
      expect(@helper.send(:valid_validation_fn!, nil)).to be(true)
    end

    it "returns true and doesn't raise an error if validation_fn is a lambda that accepts 1 argument",
      :aggregate_failures do
      validation_fn = ->(arg) { arg }
      expect { @helper.send(:valid_validation_fn!, validation_fn) }.not_to raise_error
      expect(@helper.send(:valid_validation_fn!, validation_fn)).to be(true)
    end
  end

  describe "#valid_should_raise!" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "returns true if should_raise is a Boolean",
      :aggregate_failures do
      expect(@helper.send(:valid_should_raise!, true)).to be(true)
      expect(@helper.send(:valid_should_raise!, false)).to be(true)
    end

    it "raises an ArgumentError if should_raise isn't a class or a boolean", :aggregate_failures do
      expect { @helper.send(:valid_should_raise!, "foo") }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_should_raise!, 123) }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_should_raise!, nil) }.to raise_error(ArgumentError)
    end
  end

  describe "#valid_error_class!" do
    before(:all) do
      @helper = BasicValidatorHelper.new
    end

    it "returns true if error_class is a Class that is or inherits from StandardError",
      :aggregate_failures do
      expect(@helper.send(:valid_error_class!, StandardError)).to be(true)
      expect(@helper.send(:valid_error_class!, ArgumentError)).to be(true)
      expect(@helper.send(:valid_error_class!, TypeError)).to be(true)
    end

    it "raises an ArgumentError if error_class is an instance of StandardError",
      :aggregate_failures do
      expect { @helper.send(:valid_error_class!, StandardError.new) }
        .to raise_error(ArgumentError)
      expect { @helper.send(:valid_error_class!, ArgumentError.new) }
        .to raise_error(ArgumentError)
      expect { @helper.send(:valid_error_class!, TypeError.new) }
        .to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if error_class is a Class that doesn't inherit from StandardError",
      :aggregate_failures do
      expect { @helper.send(:valid_error_class!, Exception) }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_error_class!, String) }.to raise_error(ArgumentError)
    end

    it "raises an ArgumentError if error_class is not a Class" do
      expect { @helper.send(:valid_error_class!, "foo") }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_error_class!, 123) }.to raise_error(ArgumentError)
      expect { @helper.send(:valid_error_class!, nil) }.to raise_error(ArgumentError)
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
      expected_result = "test_value must be a Integer but is a String: foo"
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
