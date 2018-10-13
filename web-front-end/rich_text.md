# react-draft-wysiwyg基于React的富文本编辑器

### html-to-draftjs
用于将带有html标记的文本在编辑器中显示

### draftjs-to-html
将html标记转换成文本显示

### draftToMarkdown
转换成Markdown

```jsx
/**
 * Created by hao.cheng on 2017/4/26.
 */
import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import draftToMarkdown from 'draftjs-to-markdown';

//自定义的
import { postPhoto } from '../../fetch/post';
import { URL } from '../../../config';

const rawContentState = {"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"http://i.imgur.com/aMtBIep.png","height":"auto","width":"100%"}}},"blocks":[{"key":"9unl6","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"95kn","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"7rjes","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};

class Wysiwyg extends Component {
    constructor(props) {
        super(props)
        const contentBlock = htmlToDraft(this.props.discription);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const outputEditorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState: outputEditorState
            }
        }else{
            this.state = {
                editorContent: undefined,
                contentState: rawContentState
            }
        }
    }

    onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });

        this.props.callbackParent(draftToHtml(editorContent));
    };

    clearContent = () => {
        this.setState({
            contentState: '',
        });
    };

    onContentStateChange = (contentState) => {
        //console.log('contentState', contentState);
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    //此处可用于将图片保存于本地或者第三方平台
    //需以{ data: { link: '图片地址'} } 这种方式返回promise对象
    imageUploadCallBack = file => new Promise(
        (resolve, reject) => {
        	const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('POST', `${URL}photo/upload`);
            const data = new FormData(); // eslint-disable-line no-undef
            data.append('file', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve({ data: { link: `${URL}uploads/${response.filename}`} });
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );

    render() {


        const { editorContent, editorState } = this.state;

        return (
            <div style={{border: "1px solid #eee"}}>
                <Row gutter={16}>
                    <Col span={24}>
                        <div>
                            <Card title="富文本编辑器" bordered={false} >
                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="home-toolbar"
                                    wrapperClassName="home-wrapper"
                                    editorClassName="home-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                    /* toolbar={{
                                        history: { inDropdown: true },
                                        inline: { inDropdown: false },
                                        list: { inDropdown: true },
                                        textAlign: { inDropdown: true },
                                        image: { uploadCallback: this.imageUploadCallBack },
                                    }} */
                                    onContentStateChange={this.onEditorChange}
                                    placeholder="请输入正文~~尝试@哦，有惊喜"
                                    spellCheck
                                    onFocus={() => {}}
                                    onBlur={() => {}}
                                    onTab={() => {return true;}}
                                    localization={{ locale: 'zh', translations: {'generic.add': '添加'} }}
                                    mention={{
                                        separator: ' ',
                                        trigger: '@',
                                        caseSensitive: true,
                                        suggestions: [
                                            { text: 'A', value: 'AB', url: 'href-a' },
                                            { text: 'AB', value: 'ABC', url: 'href-ab' },
                                            { text: 'ABC', value: 'ABCD', url: 'href-abc' },
                                            { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' },
                                            { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' },
                                            { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' },
                                            { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' },
                                        ],
                                    }}
                                />

                                <style>{`
                                    .home-editor {
                                        min-height: 60px;
                                    }
                                `}</style>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card title="同步转换HTML" bordered={false}>
                            <pre>{draftToHtml(editorContent)}</pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card title="同步转换MarkDown" bordered={false}>
                            <pre style={{whiteSpace: 'pre-wrap'}}>{draftToMarkdown(editorContent)}</pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card title="同步转换JSON" bordered={false}>
                            <pre style={{whiteSpace: 'normal'}}>{JSON.stringify(editorContent)}</pre>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Wysiwyg;
```
