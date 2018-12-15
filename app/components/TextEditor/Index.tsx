import * as React from 'react';
import RichTextEditor, {ButtonGroup, Button, PopoverIconButton} from 'react-rte';
import FontAwesome from 'react-fontawesome';
import * as Immutable from 'immutable';

// serialization options:
// 1 - Store someting custom in markdown
// 2 - store serialized editor state
// 3 - store images and render them as videos

// Wrap RichTextEditor for video support
export default class TextEditor extends React.PureComponent<any> {
  state = {
    // value : RichTextEditor.editov
    showVideoInput : false 
  }

  toggleVideoInput = () => {
    this.setState({ showVideoInput: !this.state.showVideoInput})
  }
  insertVideo = (userInput, editorState) => {
    console.log(userInput);
  }

  render() {
    console.log(`rte: ${PopoverIconButton}`)
    // Add 'react-rte' button to insert video
    // render by passing blockRenderMap though
    // extra props pass though to draft-js Editor
    return <RichTextEditor 
      {...this.props}
      customControls={[
        (setValue,getValue,editorState) => {
          return <ButtonGroup key={"cw-buttons"}>
            <Button 
              label="Video"
              iconName="image"
              focusOnClick={false}
              showPopover={this.state.showVideoInput}
              onTogglePopover={this.toggleVideoInput}
              onSubmit={s => this.insertVideo(s, editorState)}
            />
          </ButtonGroup>
        }
      ]}
     />
  }
}

// pass though odd 'static' functions from RichTextEditor
Object.assign(TextEditor,
  ...RichTextEditor
)

