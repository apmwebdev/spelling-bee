class CreateAnswers < ActiveRecord::Migration[7.0]
  def change
    create_table :answers do |t|
      t.references :puzzle, null: false, foreign_key: true
      t.references :word_text, type: :string, null: false, foreign_key: { to_table: :words, primary_key: :text }

      t.timestamps
    end
    rename_column :answers, :word_text_id, :word_text
  end
end
