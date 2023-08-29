export const InitIsStickyHelpText = () => (
  <div>
    <h3>Initial Panel Display: Sticky</h3>
    <p>
      On a page refresh or when navigating to a new puzzle, this panel will load
      as either expanded or collapsed based on its last known state. The same
      goes for blurred vs non-blurred.
    </p>
    <p>
      When enabled, this setting disables the ability to set the initial display
      Expanded and Blurred settings manually, since this sets them
      automatically.
    </p>
  </div>
);

export const InitIsExpandedHelpText = () => (
  <div>
    <h3>Initial Panel Display: Expanded</h3>
    <p>
      On a page refresh or when navigating to a new puzzle, this hint panel will
      load as expanded (i.e., not collapsed) if this setting is checked.
      Otherwise, the panel will load as collapsed.
    </p>
    <p>
      Note that this setting is overridden by the "Sticky" setting, since that
      remembers the collapsed vs. expanded state of the panel and loads that
      automatically instead.
    </p>
  </div>
);

export const InitIsBlurredHelpText = () => (
  <div>
    <h3>Initial Panel Display: Blurred</h3>
    <p>
      On a page refresh or when navigating to a new puzzle, this hint panel will
      load with the hint content (though not the settings) covered. You can then
      uncover it manually. This is useful if you want to tweak the settings
      before viewing hints, or just want more fine-tuned control over when you
      view them.
    </p>
    <p>
      Note that this setting is overridden by the "Sticky" setting, since that
      remembers the blurred vs. visible state of the panel and loads that
      automatically instead.
    </p>
  </div>
);

export const InitIsSettingsStickyHelpText = () => (
  <div>
    <h3>Initial Panel Display: Settings Sticky</h3>
    <p>
      On a page refresh or when navigating to a new puzzle, this hint panel will
      load with the settings section expanded or collapsed based on whether they
      were expanded or collapsed previously.
    </p>
    <p>
      This setting overrides the initial display Settings Expanded setting,
      since this sets the expanded/collapsed state automatically.
    </p>
  </div>
);

export const InitIsSettingsExpandedHelpText = () => (
  <div>
    <h3>Initial Panel Display: Settings Expanded</h3>
    <p>
      On a page refresh or when navigating to a new puzzle, this hint panel will
      load with the settings expanded (i.e., not collapsed) if this setting is
      checked. Otherwise, the settings will load as collapsed.
    </p>
    <p>
      Note that this setting is overridden by the "Settings Sticky" setting,
      since that remembers the collapsed vs. expanded state of the settings and
      and loads that automatically instead.
    </p>
  </div>
)
