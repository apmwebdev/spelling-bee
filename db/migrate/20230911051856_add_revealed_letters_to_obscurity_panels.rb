class AddRevealedLettersToObscurityPanels < ActiveRecord::Migration[7.0]
  def change
    unless column_exists? :obscurity_panels, :revealed_letters
      add_column :obscurity_panels, :revealed_letters, :integer, null: false,
        default: 1
      add_check_constraint :obscurity_panels,
        "revealed_letters > 0",
        name: "positive_revealed_letters"
    end
    remove_column(:obscurity_panels, :reveal_first_letter, :boolean,
      default: true, null: false, if_exists: true,
    )
  end
end
