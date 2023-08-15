class CreateSubstringHintOutputTypesEnum < ActiveRecord::Migration[7.0]
  def up
    create_enum :substring_hint_output_types, ["word_length_grid", "word_count_list", "letters_list"]
  end

  def down
    execute <<-SQL
        DROP TYPE substring_hint_output_types;
    SQL
  end
end
