# frozen_string_literal: true

module SeedStatusTrackingOptions
  def self.seed
    StatusTrackingOption.create!(key: "found_of_total", title: "Found of Total")
    StatusTrackingOption.create!(key: "remaining_of_total", title: "Remaining of Total")
    StatusTrackingOption.create!(key: "found", title: "Found")
    StatusTrackingOption.create!(key: "remaining", title: "Remaining")
    StatusTrackingOption.create!(key: "total", title: "Total")
  end
end
