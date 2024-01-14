# frozen_string_literal: true

module TimeConverter
  extend ActiveSupport::Concern

  private

  def jsify_timestamp(timestamp)
    (BigDecimal(timestamp.to_f.to_s) * 1000).to_i
  end
end
