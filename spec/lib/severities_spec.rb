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

RSpec.describe Severities do
  before(:all) do
    # Create an anonymous class with this module included for each test
    @dummy = Class.new do
      include Severities
    end.new
  end

  describe "#parse_severity" do
    context "when as_symbol is true" do
      let(:as_symbol) { true }

      it "returns the severity symbol passed to it if passed a severity symbol",
        :aggregate_failures do
        expect(@dummy.parse_severity(:debug, as_symbol:)).to eq(:debug)
        expect(@dummy.parse_severity(:info, as_symbol:)).to eq(:info)
        expect(@dummy.parse_severity(:warn, as_symbol:)).to eq(:warn)
        expect(@dummy.parse_severity(:error, as_symbol:)).to eq(:error)
        expect(@dummy.parse_severity(:fatal, as_symbol:)).to eq(:fatal)
        expect(@dummy.parse_severity(:unknown, as_symbol:)).to eq(:unknown)
      end

      it "returns the corresponding severity symbol when passed a valid integer",
        :aggregate_failures do
        expect(@dummy.parse_severity(Logger::DEBUG, as_symbol:)).to eq(:debug)
        expect(@dummy.parse_severity(Logger::INFO, as_symbol:)).to eq(:info)
        expect(@dummy.parse_severity(Logger::WARN, as_symbol:)).to eq(:warn)
        expect(@dummy.parse_severity(Logger::ERROR, as_symbol:)).to eq(:error)
        expect(@dummy.parse_severity(Logger::FATAL, as_symbol:)).to eq(:fatal)
        expect(@dummy.parse_severity(Logger::UNKNOWN, as_symbol:)).to eq(:unknown)
      end

      context "when default is a valid symbol (:info)" do
        let(:default) { :info }

        it "returns default if to_parse is nil" do
          expect(@dummy.parse_severity(nil, default:, as_symbol:)).to eq(default)
        end

        it "returns default if to_parse is a string" do
          expect(@dummy.parse_severity("error", default:, as_symbol:)).to eq(default)
        end

        it "returns a symbol if passed a valid symbol or integer", :aggregate_failures do
          expect(@dummy.parse_severity(:debug, default:, as_symbol:)).to eq(:debug)
          expect(@dummy.parse_severity(Logger::WARN, default:, as_symbol:)).to eq(:warn)
        end
      end

      context "when default is an integer (2)" do
        let(:default) { 2 }

        it "returns symbol corresponding to default if to_parse is nil" do
          expect(@dummy.parse_severity(nil, default:, as_symbol:)).to eq(:warn)
        end

        it "returns :warn if to_parse is an out of range integer" do
          expect(@dummy.parse_severity(7, default:, as_symbol:)).to eq(:warn)
        end

        it "still returns a symbol if passed a valid symbol or integer", :aggregate_failures do
          expect(@dummy.parse_severity(:fatal, default:, as_symbol:)).to eq(:fatal)
          expect(@dummy.parse_severity(3, default:, as_symbol:)).to eq(:error)
        end
      end

      it "returns :info if to_parse and default are both invalid", :aggregate_failures do
        expect(@dummy.parse_severity(nil, default: nil, as_symbol:)).to eq(:info)
        expect(@dummy.parse_severity("blah", default: :foobar, as_symbol:)).to eq(:info)
      end
    end

    context "when as_symbol is false" do
      let(:as_symbol) { false }

      it "returns the valid integer passed to it if passed a valid integer",
        :aggregate_failures do
        expect(@dummy.parse_severity(Logger::DEBUG, as_symbol:)).to eq(Logger::DEBUG)
        expect(@dummy.parse_severity(Logger::INFO, as_symbol:)).to eq(Logger::INFO)
        expect(@dummy.parse_severity(Logger::WARN, as_symbol:)).to eq(Logger::WARN)
        expect(@dummy.parse_severity(Logger::ERROR, as_symbol:)).to eq(Logger::ERROR)
        expect(@dummy.parse_severity(Logger::FATAL, as_symbol:)).to eq(Logger::FATAL)
        expect(@dummy.parse_severity(Logger::UNKNOWN, as_symbol:)).to eq(Logger::UNKNOWN)
      end

      it "returns the corresponding integer when passed a valid symbol",
        :aggregate_failures do
        expect(@dummy.parse_severity(:debug, as_symbol:)).to eq(Logger::DEBUG)
        expect(@dummy.parse_severity(:info, as_symbol:)).to eq(Logger::INFO)
        expect(@dummy.parse_severity(:warn, as_symbol:)).to eq(Logger::WARN)
        expect(@dummy.parse_severity(:error, as_symbol:)).to eq(Logger::ERROR)
        expect(@dummy.parse_severity(:fatal, as_symbol:)).to eq(Logger::FATAL)
        expect(@dummy.parse_severity(:unknown, as_symbol:)).to eq(Logger::UNKNOWN)
      end

      context "when default is a valid integer (0)" do
        let(:default) { 0 }

        it "returns the default integer when to_parsed is nil" do
          expect(@dummy.parse_severity(nil, default:, as_symbol:)).to eq(default)
        end

        it "returns the default integer when to_parsed is invalid", :aggregate_failures do
          expect(@dummy.parse_severity("fatal", default:, as_symbol:)).to eq(default)
          expect(@dummy.parse_severity(:flimflam, default:, as_symbol:)).to eq(default)
          expect(@dummy.parse_severity(["blah"], default:, as_symbol:)).to eq(default)
          expect(@dummy.parse_severity(24, default:, as_symbol:)).to eq(default)
        end

        it "returns the corresponding integer if passed a valid integer or symbol",
          :aggregate_failures do
          expect(@dummy.parse_severity(:unknown, default:, as_symbol:)).to eq(Logger::UNKNOWN)
          expect(@dummy.parse_severity(Logger::ERROR, default:, as_symbol:)).to eq(Logger::ERROR)
        end
      end

      context "when default is a valid symbol" do
        let(:default) { :unknown }

        it "returns the matching integer for default when to_parsed is invalid",
          :aggregate_failures do
          expect(@dummy.parse_severity(nil, default:, as_symbol:)).to(
            eq(Severities::SEVERITIES[default]),
          )
          expect(@dummy.parse_severity("blah", default:, as_symbol:)).to eq(5)
        end
      end
    end
  end
end
