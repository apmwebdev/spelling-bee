# frozen_string_literal: true

# Super Spelling Bee - An enhanced version of the New York Times Spelling Bee.
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# Seed default hint profiles and user hint profiles for testing
class HintProfileSeeder
  def initialize(logger: nil, rethrow: false)
    @logger = logger || ContextualLogger.new(global_puts_only: true)
    @rethrow = rethrow
  end

  # Highest level (i.e., most general) methods

  def seed!(seed_user_if_needed: false)
    seed_default_profiles
    seed_user_profiles!(seed_user_if_needed:)
  rescue StandardError => e
    raise e if @rethrow
    @logger.exception e, :fatal
  end

  # Destroy all default profiles and all user profiles where user_id == 1, reset ID sequences
  def unseed
    unseed_default_profiles
    unseed_user_profiles
  end

  # Destroy ALL hint profiles. While this should in theory also destroy all dependent data
  # (i.e., panels, panel subtypes, display states, and search panel searches), dependent data
  # is explicitly destroyed here, just in case.
  def hard_unseed
    DefaultHintProfile.destroy_all
    UserHintProfile.destroy_all
    HintPanel.destroy_all
    DefinitionPanel.destroy_all
    LetterPanel.destroy_all
    ObscurityPanel.destroy_all
    SearchPanelSearch.destroy_all
    SearchPanel.destroy_all
    PanelDisplayState.destroy_all
    reset_profile_ids
  end

  # 2nd level methods: More specific

  def seed_default_profiles
    seed_super_sb_profile
    seed_sb_buddy_profile
  end

  def seed_user_profiles!(seed_user_if_needed:)
    if User.none? && seed_user_if_needed
      DevAdminUserSeeder.new(logger:, rethrow: true).seed!
    elsif User.none? && !seed_user_if_needed
      raise StandardError,
        "At least one user must exist to seed user hint profiles. " \
          "If you'd like to seed an admin user as part of the user profile " \
          "seeding process, pass the keyword argument `seed_user_if_needed` " \
          "with a value of `true` to `#seed` or `#seed_user_profiles`."
    end

    seed_user_profile1
    seed_user_profile2
  end

  def unseed_default_profiles
    DefaultHintProfile.destroy_all
    IdResetter.reset(DefaultHintProfile)
    reset_panel_ids
  end

  def unseed_user_profiles
    UserHintProfile.where(user_id: 1).destroy_all
    IdResetter.reset(UserHintProfile)
    reset_panel_ids
  end

  # 3rd level: Methods for seeding specific profiles

  def seed_super_sb_profile
    ssb_profile = DefaultHintProfile.create!(name: "Super Spelling Bee")

    HintPanel.create!(
      name: "Word Lengths - First Letter",
      display_index: 0,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        hide_known: false,
      ),
      **default_boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Word Count - First 2 Letters",
      display_index: 1,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false,
      ),
      **default_boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Letter Search",
      display_index: 2,
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0,
      ),
      **default_boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      display_index: 3,
      panel_subtype: ObscurityPanel.new(
        hide_known: false,
        separate_known: false,
        revealed_letters: 1,
        reveal_length: true,
        click_to_define: true,
        sort_order: "asc",
      ),
      **default_boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Word Definitions",
      display_index: 4,
      panel_subtype: DefinitionPanel.new(
        hide_known: false,
        revealed_letters: 1,
        separate_known: true,
        reveal_length: true,
        show_obscurity: true,
        sort_order: "asc",
      ),
      **default_boilerplate_fields(ssb_profile),
    )
  end

  def seed_sb_buddy_profile
    sb_buddy_profile = DefaultHintProfile.create!(name: "NYT Spelling Bee Buddy")

    HintPanel.create!(
      name: "Your Grid of Remaining Words",
      display_index: 0,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        hide_known: false,
      ),
      **default_boilerplate_fields(sb_buddy_profile, status_tracking: "remaining"),
    )

    HintPanel.create!(
      name: "Your Two-Letter List",
      display_index: 1,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false,
      ),
      **default_boilerplate_fields(sb_buddy_profile, status_tracking: "remaining"),
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      display_index: 2,
      panel_subtype: ObscurityPanel.new(
        hide_known: true,
        separate_known: false,
        revealed_letters: 1,
        reveal_length: true,
        click_to_define: false,
        sort_order: "asc",
      ),
      **default_boilerplate_fields(sb_buddy_profile),
    )

    HintPanel.create!(
      name: "Word Definitions",
      display_index: 3,
      panel_subtype: DefinitionPanel.new(
        hide_known: true,
        revealed_letters: 1,
        separate_known: true,
        reveal_length: true,
        show_obscurity: false,
        sort_order: "asc",
      ),
      **default_boilerplate_fields(sb_buddy_profile),
    )
  end

  def seed_user_profile1
    prof1 = UserHintProfile.create!(
      name: "Search Test",
      user_id: User.first.id,
      default_panel_tracking: "found_of_total",
      default_panel_display_state: user_display_state,
    )

    HintPanel.create!(
      name: "Search",
      display_index: 0,
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0,
      ),
      **user_boilerplate_fields(prof1),
    )

    HintPanel.create!(
      name: "First Letter WLG",
      display_index: 1,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        hide_known: false,
      ),
      **user_boilerplate_fields(prof1),
    )

    HintPanel.create!(
      name: "First 2 Letters WCL",
      display_index: 2,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false,
      ),
      **user_boilerplate_fields(prof1),
    )
  end

  def seed_user_profile2
    prof2 = UserHintProfile.create!(
      name: "My Profile",
      user_id: User.first.id,
      default_panel_tracking: "found_of_total",
      default_panel_display_state: user_display_state,
    )

    HintPanel.create!(
      name: "First 2 Letters WLG",
      display_index: 0,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false,
      ),
      **user_boilerplate_fields(prof2),
    )

    HintPanel.create!(
      name: "Search",
      display_index: 1,
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0,
      ),
      **user_boilerplate_fields(prof2),
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      display_index: 2,
      panel_subtype: ObscurityPanel.new(
        hide_known: false,
        revealed_letters: 1,
        separate_known: false,
        click_to_define: true,
        reveal_length: true,
        sort_order: "asc",
      ),
      **user_boilerplate_fields(prof2),
    )

    HintPanel.create!(
      name: "Word Definitions",
      display_index: 3,
      panel_subtype: DefinitionPanel.new(
        hide_known: true,
        revealed_letters: 1,
        separate_known: true,
        reveal_length: true,
        show_obscurity: false,
        sort_order: "asc",
      ),
      **user_boilerplate_fields(prof2),
    )
  end

  def seed_search_test_searches
    SearchPanelSearch.create!(
      search_panel_id: 2,
      user_puzzle_attempt_id: 13,
      location: "anywhere",
      output_type: "word_length_grid",
      letters_offset: 0,
      search_string: "men",
    )
    SearchPanelSearch.create!(
      search_panel_id: 2,
      user_puzzle_attempt_id: 13,
      location: "anywhere",
      output_type: "word_count_list",
      letters_offset: 0,
      search_string: "men",
    )
    SearchPanelSearch.create!(
      search_panel_id: 2,
      user_puzzle_attempt_id: 13,
      location: "anywhere",
      output_type: "letters_list",
      letters_offset: 0,
      search_string: "men",
    )
  end

  private

  def default_display_state
    PanelDisplayState.new(
      is_expanded: true,
      is_blurred: false,
      is_sticky: false,
      is_settings_expanded: false,
      is_settings_sticky: false,
    )
  end

  def default_boilerplate_fields(profile, status_tracking: "found_of_total")
    {
      hint_profile: profile,
      hint_profile_uuid: profile.uuid,
      status_tracking:,
      initial_display_state: default_display_state,
      current_display_state: default_display_state,
    }
  end

  def reset_panel_ids
    IdResetter.reset(
      HintPanel,
      DefinitionPanel,
      LetterPanel,
      ObscurityPanel,
      SearchPanel,
      PanelDisplayState,
      SearchPanelSearch,
    )
  end

  def reset_profile_ids
    IdResetter.reset(
      DefaultHintProfile,
      UserHintProfile,
    )
    reset_panel_ids
  end

  def user_display_state
    PanelDisplayState.new(
      is_expanded: true,
      is_blurred: false,
      is_sticky: true,
      is_settings_expanded: false,
      is_settings_sticky: true,
    )
  end

  def user_boilerplate_fields(profile)
    {
      hint_profile: profile,
      hint_profile_uuid: profile.uuid,
      status_tracking: "found_of_total",
      initial_display_state: user_display_state,
      current_display_state: user_display_state,
    }
  end
end
