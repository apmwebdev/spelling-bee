class AddSeparateKnownToDefinitionPanels < ActiveRecord::Migration[7.0]
  def change
    add_column :definition_panels, :separate_known, :boolean, default: true,
      null: false, if_not_exists: true
  end
end
