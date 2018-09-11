/**
 * Provides the javascript for managing categories.
 *
 * @copyright  2014-2015 Horde LLC
 * @license    LGPL-2 (http://www.horde.org/licenses/lgpl)
 */

var HordeCategoryPrefs = {

    // Variables defaulting to null: category_text

    removeCategory: function(e)
    {
        var p = $('prefs');
        $(p.cAction).setValue('remove');
        $(p.category).setValue(e.element().up().readAttribute('category'));
        p.submit();
    },

    addCategory: function()
    {
        var category = window.prompt(this.category_text, ''), p;
        if (!category.empty()) {
            p = $('prefs');
            $(p.cAction).setValue('add');
            $(p.category).setValue(category);
            p.submit();
        }
    },

    resetBackgrounds: function()
    {
        $('prefs').getInputs('text').each(function(i) {
            if (i.readAttribute('id').startsWith('color_')) {
                i.setStyle({ backgroundColor: $F(i) });
            }
        });
    },

    colorPicker: function(e)
    {
        var elt = e.element(),
            input = elt.up().previous('INPUT');

        new ColorPicker({
            color: $F(input),
            offsetParent: elt,
            update: [ [ input, 'value' ], [ input, 'background' ] ]
        });

        e.stop();
    },

    onDomLoad: function()
    {
        $('prefs').observe('reset', function() {
            this.resetBackgrounds.defer();
        }.bind(this));
        $('add_category').observe('click', this.addCategory.bind(this));

        $$('.categoryColorPicker').invoke('observe', 'click', this.colorPicker.bindAsEventListener(this));
        $$('.categoryDelete').invoke('observe', 'click', this.removeCategory.bindAsEventListener(this));
    }

};

document.observe('dom:loaded', HordeCategoryPrefs.onDomLoad.bind(HordeCategoryPrefs));
