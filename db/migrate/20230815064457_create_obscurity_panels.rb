class CreateObscurityPanels < ActiveRecord::Migration[7.0]
  def change
    create_table :obscurity_panels do |t|
      t.boolean :show_known, default: true, null: false
      t.boolean :separate_known, default: false, null: false
      t.boolean :reveal_first_letter, default: true, null: false
      t.boolean :reveal_length, default: true, null: false
      t.boolean :click_to_define, default: false, null: false
      t.enum :sort_order, enum_type: :sort_order_options, default: "asc", null: false

      t.timestamps
    end
  end
end
