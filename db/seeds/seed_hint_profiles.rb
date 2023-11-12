# Super Spelling Bee - An enhanced version of the New York Times Spelling Bee.
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# frozen_string_literal: true

module SeedHintProfiles
  def self.default_display_state
    PanelDisplayState.new(
      is_expanded: false,
      is_blurred: false,
      is_sticky: false,
      is_settings_expanded: false,
      is_settings_sticky: false
    )
  end

  def self.boilerplate_fields(profile)
    {
      hint_profile: profile,
      status_tracking: "found_of_total",
      initial_display_state: default_display_state,
      current_display_state: default_display_state
    }
  end

  def self.seed_super_sb_profile
    ssb_profile = DefaultHintProfile.create!(name: "Super Spelling Bee")

    HintPanel.create!(
      name: "Word Lengths - First Letter",
      display_index: 0,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        hide_known: false
      ),
      **boilerplate_fields(ssb_profile)
    )

    HintPanel.create!(
      name: "Word Count - First 2 Letters",
      display_index: 1,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false
      ),
      **boilerplate_fields(ssb_profile)
    )

    HintPanel.create!(
      name: "Letter Search",
      display_index: 2,
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0
      ),
      **boilerplate_fields(ssb_profile)
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      display_index: 3,
      panel_subtype: ObscurityPanel.new(
        hide_known: false,
        separate_known: false,
        revealed_letters: 1,
        reveal_length: true,
        click_to_define: false,
        sort_order: "asc"
      ),
      **boilerplate_fields(ssb_profile)
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
        sort_order: "asc"
      ),
      **boilerplate_fields(ssb_profile)
    )
  end

  def self.seed_sb_buddy_profile
    sbb_profile = DefaultHintProfile.create!(name: "NYT Spelling Bee Buddy")

    HintPanel.create!(
      name: "Your Grid of Remaining Words",
      display_index: 0,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        hide_known: false
      ),
      hint_profile: sbb_profile,
      status_tracking: "remaining",
      initial_display_state: default_display_state,
      current_display_state: default_display_state
    )

    HintPanel.create!(
      name: "Your Two-Letter List",
      display_index: 1,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false
      ),
      hint_profile: sbb_profile,
      status_tracking: "remaining",
      initial_display_state: default_display_state,
      current_display_state: default_display_state
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
        sort_order: "asc"
      ),
      hint_profile: sbb_profile,
      status_tracking: "found_of_total",
      initial_display_state: default_display_state,
      current_display_state: default_display_state
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
        sort_order: "asc"
      ),
      hint_profile: sbb_profile,
      status_tracking: "found_of_total",
      initial_display_state: default_display_state,
      current_display_state: default_display_state
    )
  end

  def self.user_display_state
    PanelDisplayState.new(
      is_expanded: true,
      is_blurred: false,
      is_sticky: true,
      is_settings_expanded: false,
      is_settings_sticky: true
    )
  end

  def self.user_panel_boilerplate(profile)
    {
      hint_profile: profile,
      status_tracking: "found_of_total",
      initial_display_state: user_display_state,
      current_display_state: user_display_state
    }
  end

  def self.seed_user_profile_1
    prof_1 = UserHintProfile.create!(
      name: "Search Test",
      user_id: User.first.id,
      default_panel_tracking: "found_of_total",
      default_panel_display_state: user_display_state
    )

    HintPanel.create!(
      name: "Search",
      display_index: 0,
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0
      ),
      **user_panel_boilerplate(prof_1)
    )

    HintPanel.create!(
      name: "First Letter WLG",
      display_index: 1,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        hide_known: false
      ),
      **user_panel_boilerplate(prof_1)
    )

    HintPanel.create!(
      name: "First 2 Letters WCL",
      display_index: 2,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false
      ),
      **user_panel_boilerplate(prof_1)
    )
  end

  def self.seed_search_test_searches
    SearchPanelSearch.create!(
      search_panel_id: 2,
      user_puzzle_attempt_id: 13,
      location: "anywhere",
      output_type: "word_length_grid",
      letters_offset: 0,
      search_string: "men"
    )
    SearchPanelSearch.create!(
      search_panel_id: 2,
      user_puzzle_attempt_id: 13,
      location: "anywhere",
      output_type: "word_count_list",
      letters_offset: 0,
      search_string: "men"
    )
    SearchPanelSearch.create!(
      search_panel_id: 2,
      user_puzzle_attempt_id: 13,
      location: "anywhere",
      output_type: "letters_list",
      letters_offset: 0,
      search_string: "men"
    )
  end

  def self.seed_user_profile_2
    prof_2 = UserHintProfile.create!(
      name: "My Profile",
      user_id: User.first.id,
      default_panel_tracking: "found_of_total",
      default_panel_display_state: user_display_state
    )

    HintPanel.create!(
      name: "First 2 Letters WLG",
      display_index: 0,
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 2,
        letters_offset: 0,
        hide_known: false
      ),
      **user_panel_boilerplate(prof_2)
    )

    HintPanel.create!(
      name: "Search",
      display_index: 1,
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0
      ),
      **user_panel_boilerplate(prof_2)
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      display_index: 2,
      panel_subtype: ObscurityPanel.new(
        hide_known: false,
        revealed_letters: 1,
        separate_known: false,
        click_to_define: false,
        reveal_length: true,
        sort_order: "asc"
      ),
      **user_panel_boilerplate(prof_2)
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
        sort_order: "asc"
      ),
      **user_panel_boilerplate(prof_2)
    )
  end

  def self.seed_default_profiles
    seed_super_sb_profile
    seed_sb_buddy_profile
  end

  def self.seed_user_profiles
    seed_user_profile_1
    seed_user_profile_2
    User.first.user_pref.current_hint_profile_type = "UserHintProfile"
    User.first.user_pref.current_hint_profile_id = 1
    User.first.user_pref.save
  end

  def self.seed
    seed_default_profiles
    seed_user_profiles
  end

  def self.reset_dependent_ids
    ResetId.reset(
      HintPanel,
      DefinitionPanel,
      LetterPanel,
      ObscurityPanel,
      SearchPanel,
      PanelDisplayState,
      SearchPanelSearch
    )
  end

  def self.reset_all_ids
    ResetId.reset(
      DefaultHintProfile,
      UserHintProfile
    )
    reset_dependent_ids
  end

  def self.unseed_default_profiles
    DefaultHintProfile.destroy_all
    ResetId.reset(DefaultHintProfile)
    reset_dependent_ids
  end

  def self.unseed_user_profiles
    UserHintProfile.where(user_id: 1).destroy_all
    ResetId.reset(UserHintProfile)
    reset_dependent_ids
  end

  def self.unseed
    unseed_default_profiles
    unseed_user_profiles
  end

  def self.hard_unseed
    DefaultHintProfile.destroy_all
    UserHintProfile.destroy_all
    HintPanel.destroy_all
    DefinitionPanel.destroy_all
    LetterPanel.destroy_all
    ObscurityPanel.destroy_all
    SearchPanelSearch.destroy_all
    SearchPanel.destroy_all
    PanelDisplayState.destroy_all
    reset_all_ids
  end
end
