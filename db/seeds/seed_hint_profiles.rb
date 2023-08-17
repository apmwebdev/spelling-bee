# frozen_string_literal: true

module SeedHintProfiles
  def self.default_display_state
    PanelDisplayState.new(
      is_expanded: true,
      is_blurred: true,
      is_sticky: false,
      is_settings_expanded: true,
      is_settings_sticky: false,
    )
  end

  def self.boilerplate_fields(profile)
    {
      hint_profile: profile,
      status_tracking: "found_of_total",
      initial_display_state: default_display_state,
      current_display_state: default_display_state,
    }
  end

  def self.seed_super_sb_profile
    ssb_profile = DefaultHintProfile.create!(name: "Super Spelling Bee")

    HintPanel.create!(
      name: "Word Lengths - First Letter",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        show_known: true,
      ),
      **boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Word Count - First 2 Letters",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        show_known: true,
      ),
      **boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Letter Search",
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0,
      ),
      **boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      panel_subtype: ObscurityPanel.new(
        show_known: true,
        separate_known: false,
        reveal_first_letter: true,
        reveal_length: true,
        click_to_define: false,
        sort_order: "asc",
      ),
      **boilerplate_fields(ssb_profile),
    )

    HintPanel.create!(
      name: "Word Definitions",
      panel_subtype: DefinitionPanel.new(
        show_known: true,
        reveal_length: true,
        show_obscurity: true,
        sort_order: "asc",
      ),
      **boilerplate_fields(ssb_profile)
    )
  end

  def self.seed_sb_buddy_profile
    sbb_profile = DefaultHintProfile.create!(name: "NYT Spelling Bee Buddy")

    HintPanel.create!(
      name: "Your Grid of Remaining Words",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        show_known: true,
      ),
      hint_profile: sbb_profile,
      status_tracking: "remaining",
      initial_display_state: default_display_state,
      current_display_state: default_display_state,
    )

    HintPanel.create!(
      name: "Your Two-Letter List",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        show_known: true,
      ),
      hint_profile: sbb_profile,
      status_tracking: "remaining",
      initial_display_state: default_display_state,
      current_display_state: default_display_state,
    )

    HintPanel.create!(
      name: "Word Obscurity Ranking",
      panel_subtype: ObscurityPanel.new(
        show_known: true,
        separate_known: false,
        reveal_first_letter: true,
        reveal_length: true,
        click_to_define: false,
        sort_order: "asc",
      ),
      hint_profile: sbb_profile,
      status_tracking: "found_of_total",
      initial_display_state: default_display_state,
      current_display_state: default_display_state,
    )

    HintPanel.create!(
      name: "Word Definitions",
      panel_subtype: DefinitionPanel.new(
        show_known: true,
        reveal_length: true,
        show_obscurity: false,
        sort_order: "asc",
      ),
      hint_profile: sbb_profile,
      status_tracking: "found_of_total",
      initial_display_state: default_display_state,
      current_display_state: default_display_state,
    )
  end

  def self.user_display_state
    PanelDisplayState.new(
      is_expanded: true,
      is_blurred: false,
      is_sticky: true,
      is_settings_expanded: false,
      is_settings_sticky: true,
    )
  end

  def self.user_panel_boilerplate(profile)
    {
      hint_profile: profile,
      status_tracking: "found_of_total",
      initial_display_state: user_display_state,
      current_display_state: user_display_state,
    }
  end

  def self.seed_user_profile_1
    prof_1 = UserHintProfile.create!(
      name: "Search Test",
      user_id: 13,
      default_panel_tracking: "found_of_total",
      default_panel_display_state: user_display_state,
    )

    HintPanel.create!(
      name: "Search",
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0,
      ),
      **user_panel_boilerplate(prof_1)
    )

    HintPanel.create!(
      name: "First Letter WLG",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 1,
        letters_offset: 0,
        show_known: true,
      ),
      **user_panel_boilerplate(prof_1)
    )

    HintPanel.create!(
      name: "First 2 Letters WCL",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_count_list",
        number_of_letters: 2,
        letters_offset: 0,
        show_known: true,
      ),
      **user_panel_boilerplate(prof_1)
    )
  end

  def self.seed_user_profile_2
    prof_2 = UserHintProfile.create!(
      name: "My Profile",
      user_id: 13,
      default_panel_tracking: "found_of_total",
      default_panel_display_state: user_display_state,
    )

    HintPanel.create!(
      name: "First 2 Letters WLG",
      panel_subtype: LetterPanel.new(
        location: "start",
        output_type: "word_length_grid",
        number_of_letters: 2,
        letters_offset: 0,
        show_known: true,
      ),
      **user_panel_boilerplate(prof_2)
    )

    HintPanel.create!(
      name: "Search",
      panel_subtype: SearchPanel.new(
        location: "anywhere",
        output_type: "word_length_grid",
        letters_offset: 0,
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
  end

  def self.seed
    seed_default_profiles
    seed_user_profiles
  end

  def self.unseed_default_profiles
    DefaultHintProfile.destroy_all
  end

  def self.unseed_user_profiles
    UserHintProfile.where(user_id: 13, name: "Search Test").or(
      UserHintProfile.where(user_id: 13, name: "My Profile")
    ).destroy_all
  end

  def self.unseed
    unseed_default_profiles
    unseed_user_profiles
  end
end