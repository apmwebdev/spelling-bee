# frozen_string_literal: true
module TimestampConverter
  extend ActiveSupport::Concern

  private

  def railsify_timestamp(timestamp)
    precise_timestamp = BigDecimal(timestamp.to_s)
    timestamp_in_seconds = precise_timestamp / 1000
    Time.at(timestamp_in_seconds)
  end
end
