/**
 * Provides the javascript for managing the source selection widget.
 *
 * @copyright  2014-2015 Horde LLC
 * @license    LGPL-2.1 (http://www.horde.org/licenses/lgpl21)
 */

var HordeSourceSelectPrefs = {

    // Vars defaulting to null: source_list

    setSourcesHidden: function()
    {
        var out = [], ss, selected;

        if (this.source_list) {
            ss = $F('source_select');
            if (ss) {
                this.source_list.each(function(s) {
                    selected = [];
                    if (s.source == ss) {
                        $A($('selected_sources').options).slice(1).each(function(o) {
                            selected.push(o.value);
                        });
                    } else {
                        s.selected.each(function(o) {
                            selected.push(o.v);
                        });
                    }
                    out.push([ s.source ].concat(selected));
                });
            }
        } else {
            $A($('selected_sources').options).slice(1).each(function(s) {
                out.push(s.value);
            });
        }

        $('sources').setValue(Object.toJSON(out));
    },

    moveAction: function(from, to)
    {
        var moved = false;

        $(from).childElements().each(function(c) {
            if (c.selected) {
                c.remove();
                c.selected = false;
                $(to).insert(c);
                moved = true;
            }
        });


        if (moved) {
            $(to).fire('HordeSourceSelectPrefs:add');
            $(from).fire('HordeSourceSelectPrefs:remove');
            this.setSourcesHidden();
        }
    },

    moveSource: function(e, mode)
    {
        var sa = $('selected_sources'), sel, tmp;

        if (sa.selectedIndex < 1 || sa.length < 3) {
            return;
        }

        // Deselect everything but the first selected item
        sa.childElements().each(function(s) {
            if (sel) {
                s.selected = false;
            } else if (s.selected) {
                sel = s;
            }
        });

        switch (mode) {
        case 'down':
            tmp = sel.next();
            if (tmp) {
                sel.remove();
                tmp.insert({ after: sel });
            }
            break;

        case 'up':
            tmp = sel.previous();
            if (tmp && tmp.value) {
                sel.remove();
                tmp.insert({ before: sel });
            }
            break;
        }

        this.setSourcesHidden();
        e.stop();
    },

    changeSource: function()
    {
        var source,
            sel = $('selected_sources'),
            ss = $('source_select'),
            unsel = $('unselected_sources'),
            val = $F(ss);

        sel.down().siblings().invoke('remove');
        unsel.down().siblings().invoke('remove');

        if (val) {
            source = this.source_list.find(function(s) {
                return val == s.source;
            });
            source.selected.each(function(s) {
                sel.insert(new Option(s.v, s.l));
            });
            source.unselected.each(function(u) {
                unsel.insert(new Option(u.v, u.l));
            });
        }
    },

    onDomLoad: function()
    {
        if (this.source_list) {
            $('source_select').observe('change', this.changeSource.bind(this));
        }

        this.setSourcesHidden();

        $('addsource').observe('click', this.moveAction.bind(this, 'unselected_sources', 'selected_sources'));
        $('removesource').observe('click', this.moveAction.bind(this, 'selected_sources', 'unselected_sources'));
        $('moveup').observe('click', this.moveSource.bindAsEventListener(this, 'up'));
        $('movedown').observe('click', this.moveSource.bindAsEventListener(this, 'down'));
    }

};

document.observe('dom:loaded', HordeSourceSelectPrefs.onDomLoad.bind(HordeSourceSelectPrefs));
