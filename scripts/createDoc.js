import React from 'react';
import * as fs from 'fs';
import * as electron from 'electron';
// import * as archiver from 'archiver';

const pageBreakXML = `<w:p w:rsidR="00AA39DF" w:rsidRDefault="00AA39DF"><w:r><w:br w:type="page"/></w:r></w:p>`;
const emptyParagraphXML = `<w:p w:rsidR="00647784" w:rsidRDefault="00647784" w:rsidP="00FF1561"></w:p>`;
const emptyHeaderContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14"><w:p w:rsidR="005E7666" w:rsidRDefault="005E7666"><w:pPr><w:pStyle w:val="Header"/></w:pPr></w:p></w:hdr>`;
const emptyFooterContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14"><w:p w:rsidR="005E7666" w:rsidRDefault="005E7666"><w:pPr><w:pStyle w:val="Footer"/></w:pPr></w:p></w:ftr>`;
const footNotesContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:footnotes xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14"><w:footnote w:type="separator" w:id="-1"><w:p w:rsidR="000D6364" w:rsidRDefault="000D6364" w:rsidP="005E7666"><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:separator/></w:r></w:p></w:footnote><w:footnote w:type="continuationSeparator" w:id="0"><w:p w:rsidR="000D6364" w:rsidRDefault="000D6364" w:rsidP="005E7666"><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:continuationSeparator/></w:r></w:p></w:footnote></w:footnotes>`;
const endNotesContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:endnotes xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14"><w:endnote w:type="separator" w:id="-1"><w:p w:rsidR="000D6364" w:rsidRDefault="000D6364" w:rsidP="005E7666"><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:separator/></w:r></w:p></w:endnote><w:endnote w:type="continuationSeparator" w:id="0"><w:p w:rsidR="000D6364" w:rsidRDefault="000D6364" w:rsidP="005E7666"><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:continuationSeparator/></w:r></w:p></w:endnote></w:endnotes>`;
// contentTypesContent = "";
const contentTypesParts = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/>`,`<Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/><Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`];
const relsContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
const appContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>0</TotalTime><Pages>1</Pages><Words>0</Words><Characters>5</Characters><Application>Microsoft Office Word</Application><DocSecurity>0</DocSecurity><Lines>1</Lines><Paragraphs>1</Paragraphs><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Title</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr></vt:lpstr></vt:vector></TitlesOfParts><Company></Company><LinksUpToDate>false</LinksUpToDate><CharactersWithSpaces>5</CharactersWithSpaces><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0000</AppVersion></Properties>`;
// coreContent = "";
const coreContentParts = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title></dc:title><dc:subject></dc:subject><dc:creator>Jared Beagley</dc:creator><cp:keywords></cp:keywords><dc:description></dc:description><cp:lastModifiedBy>Jared Beagley</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">`, `</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">`, `</dcterms:modified></cp:coreProperties>`];
/*toInsert in between both breaks the current date in YYYY-MM-DDTHH:MM:SSZ (ie 2017-01-21T16:34:00Z) */
// header2Content = "";
// header3Content = "";
const headerParts = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14"><w:p w:rsidR="00261B90" w:rsidRDefault="00261B90" w:rsidP="00261B90"><w:pPr><w:pStyle w:val="Header"/><w:tabs><w:tab w:val="clear" w:pos="4680"/><w:tab w:val="center" w:pos="9360"/></w:tabs></w:pPr>`, `</w:p></w:hdr>`];
// wordDocumentContent = "";
const wordDocumentContentParts = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se wp14"><w:body>`, `<w:sectPr w:rsidR="00E22951">`,`<w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/>`,`<w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`];

const fontTableContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se"><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002AFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002EFF" w:usb1="C000785B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Agency FB"><w:panose1 w:val="020B0503020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Algerian"><w:panose1 w:val="04020705040A02060702"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Arial"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002EFF" w:usb1="C0007843" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Arial Black"><w:panose1 w:val="020B0A04020102020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002AF" w:usb1="400078FB" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Arial Narrow"><w:panose1 w:val="020B0606020202030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000800" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Arial Rounded MT Bold"><w:panose1 w:val="020F0704030504030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Baskerville Old Face"><w:panose1 w:val="02020602080505020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bauhaus 93"><w:panose1 w:val="04030905020B02020C02"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bell MT"><w:panose1 w:val="02020503060305020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Berlin Sans FB"><w:panose1 w:val="020E0602020502020306"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Berlin Sans FB Demi"><w:panose1 w:val="020E0802020502020306"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bernard MT Condensed"><w:panose1 w:val="02050806060905020404"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Blackadder ITC"><w:panose1 w:val="04020505051007020D02"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bodoni MT"><w:panose1 w:val="02070603080606020203"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bodoni MT Black"><w:panose1 w:val="02070A03080606020203"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bodoni MT Condensed"><w:panose1 w:val="02070606080606020203"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Bodoni MT Poster Compressed"><w:panose1 w:val="02070706080601050204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000011" w:csb1="00000000"/></w:font><w:font w:name="Book Antiqua"><w:panose1 w:val="02040602050305030304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Bookman Old Style"><w:panose1 w:val="02050604050505020204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Bradley Hand ITC"><w:panose1 w:val="03070402050302030203"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Britannic Bold"><w:panose1 w:val="020B0903060703020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Broadway"><w:panose1 w:val="04040905080B02020502"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Brush Script MT"><w:panose1 w:val="03060802040406070304"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Calibri Light"><w:panose1 w:val="020F0302020204030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002AFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Californian FB"><w:panose1 w:val="0207040306080B030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Calisto MT"><w:panose1 w:val="02040603050505030304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Cambria"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="400004FF" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Cambria Math"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="420024FF" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Candara"><w:panose1 w:val="020E0502030303020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000A44B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Castellar"><w:panose1 w:val="020A0402060406010301"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Centaur"><w:panose1 w:val="02030504050205020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Century"><w:panose1 w:val="02040604050505020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Century Gothic"><w:panose1 w:val="020B0502020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Century Schoolbook"><w:panose1 w:val="02040604050505020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Chiller"><w:panose1 w:val="04020404031007020602"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Colonna MT"><w:panose1 w:val="04020805060202030203"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Comic Sans MS"><w:panose1 w:val="030F0702030302020204"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000013" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Consolas"><w:panose1 w:val="020B0609020204030204"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="E00006FF" w:usb1="0000FCFF" w:usb2="00000001" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Constantia"><w:panose1 w:val="02030602050306030303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Cooper Black"><w:panose1 w:val="0208090404030B020404"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Copperplate Gothic Bold"><w:panose1 w:val="020E0705020206020404"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Copperplate Gothic Light"><w:panose1 w:val="020E0507020206020404"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Corbel"><w:panose1 w:val="020B0503020204020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000A44B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Courier New"><w:panose1 w:val="02070309020205020404"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="E0002EFF" w:usb1="C0007843" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Curlz MT"><w:panose1 w:val="04040404050702020202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="DengXian"><w:altName w:val="ç­‰çº¿"/><w:panose1 w:val="03000509000000000000"/><w:charset w:val="86"/><w:family w:val="script"/><w:pitch w:val="fixed"/><w:sig w:usb0="800002BF" w:usb1="38CF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/></w:font><w:font w:name="Ebrima"><w:panose1 w:val="02000000000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A000005F" w:usb1="02000041" w:usb2="00000800" w:usb3="00000000" w:csb0="00000093" w:csb1="00000000"/></w:font><w:font w:name="Edwardian Script ITC"><w:panose1 w:val="030303020407070D0804"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Elephant"><w:panose1 w:val="02020904090505020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Engravers MT"><w:panose1 w:val="02090707080505020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Eras Bold ITC"><w:panose1 w:val="020B0907030504020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Eras Demi ITC"><w:panose1 w:val="020B0805030504020804"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Eras Light ITC"><w:panose1 w:val="020B0402030504020804"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Eras Medium ITC"><w:panose1 w:val="020B0602030504020804"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Felix Titling"><w:panose1 w:val="04060505060202020A04"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Footlight MT Light"><w:panose1 w:val="0204060206030A020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Forte"><w:panose1 w:val="03060902040502070203"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Franklin Gothic Book"><w:panose1 w:val="020B0503020102020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Franklin Gothic Demi"><w:panose1 w:val="020B0703020102020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Franklin Gothic Demi Cond"><w:panose1 w:val="020B0706030402020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Franklin Gothic Heavy"><w:panose1 w:val="020B0903020102020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Franklin Gothic Medium"><w:panose1 w:val="020B0603020102020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Franklin Gothic Medium Cond"><w:panose1 w:val="020B0606030402020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Freestyle Script"><w:panose1 w:val="030804020302050B0404"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="French Script MT"><w:panose1 w:val="03020402040607040605"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Gabriola"><w:panose1 w:val="04040605051002020D02"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002EF" w:usb1="5000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Gadugi"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000003" w:usb1="00000000" w:usb2="00003000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Garamond"><w:panose1 w:val="02020404030301010803"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Georgia"><w:panose1 w:val="02040502050405020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Gigi"><w:panose1 w:val="04040504061007020D02"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Gill Sans MT"><w:panose1 w:val="020B0502020104020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Gill Sans MT Condensed"><w:panose1 w:val="020B0506020104020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Gill Sans MT Ext Condensed Bold"><w:panose1 w:val="020B0902020104020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Gill Sans Ultra Bold"><w:panose1 w:val="020B0A02020104020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Gill Sans Ultra Bold Condensed"><w:panose1 w:val="020B0A06020104020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Gloucester MT Extra Condensed"><w:panose1 w:val="02030808020601010101"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Goudy Old Style"><w:panose1 w:val="02020502050305020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Goudy Stout"><w:panose1 w:val="0202090407030B020401"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Haettenschweiler"><w:panose1 w:val="020B0706040902060204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Harlow Solid Italic"><w:panose1 w:val="04030604020F02020D02"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Harrington"><w:panose1 w:val="04040505050A02020702"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="High Tower Text"><w:panose1 w:val="02040502050506030303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Impact"><w:panose1 w:val="020B0806030902050204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Imprint MT Shadow"><w:panose1 w:val="04020605060303030202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Informal Roman"><w:panose1 w:val="030604020304060B0204"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Javanese Text"><w:panose1 w:val="02000000000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="80000003" w:usb1="00002000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Jokerman"><w:panose1 w:val="04090605060D06020702"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Juice ITC"><w:panose1 w:val="04040403040A02020202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Kristen ITC"><w:panose1 w:val="03050502040202030202"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Kunstler Script"><w:panose1 w:val="030304020206070D0D06"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Leelawadee"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="01000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00010001" w:csb1="00000000"/></w:font><w:font w:name="Leelawadee UI"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A3000003" w:usb1="00000000" w:usb2="00010000" w:usb3="00000000" w:csb0="00010101" w:csb1="00000000"/></w:font><w:font w:name="Leelawadee UI Semilight"><w:panose1 w:val="020B0402040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A3000003" w:usb1="00000000" w:usb2="00010000" w:usb3="00000000" w:csb0="00010101" w:csb1="00000000"/></w:font><w:font w:name="Lucida Bright"><w:panose1 w:val="02040602050505020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Lucida Calligraphy"><w:panose1 w:val="03010101010101010101"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Lucida Console"><w:panose1 w:val="020B0609040504020204"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="8000028F" w:usb1="00001800" w:usb2="00000000" w:usb3="00000000" w:csb0="0000001F" w:csb1="00000000"/></w:font><w:font w:name="Lucida Fax"><w:panose1 w:val="02060602050505020204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Lucida Handwriting"><w:panose1 w:val="03010101010101010101"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Lucida Sans"><w:panose1 w:val="020B0602030504020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Lucida Sans Typewriter"><w:panose1 w:val="020B0509030504030204"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Lucida Sans Unicode"><w:panose1 w:val="020B0602030504020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000AFF" w:usb1="0000396B" w:usb2="00000000" w:usb3="00000000" w:csb0="000000BF" w:csb1="00000000"/></w:font><w:font w:name="Magneto"><w:panose1 w:val="04030805050802020D02"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Maiandra GD"><w:panose1 w:val="020E0502030308020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Malgun Gothic"><w:panose1 w:val="020B0503020000020004"/><w:charset w:val="81"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="9000002F" w:usb1="29D77CFB" w:usb2="00000012" w:usb3="00000000" w:csb0="00080001" w:csb1="00000000"/></w:font><w:font w:name="Malgun Gothic Semilight"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="81"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="B0000AAF" w:usb1="09DF7CFB" w:usb2="00000012" w:usb3="00000000" w:csb0="003E01BD" w:csb1="00000000"/></w:font><w:font w:name="Matura MT Script Capitals"><w:panose1 w:val="03020802060602070202"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Microsoft Himalaya"><w:panose1 w:val="01010100010101010101"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="80000003" w:usb1="00010000" w:usb2="00000040" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Microsoft JhengHei"><w:panose1 w:val="020B0604030504040204"/><w:charset w:val="88"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="000002A7" w:usb1="28CF4400" w:usb2="00000016" w:usb3="00000000" w:csb0="00100009" w:csb1="00000000"/></w:font><w:font w:name="Microsoft JhengHei Light"><w:panose1 w:val="020B0304030504040204"/><w:charset w:val="88"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="800002A7" w:usb1="28CF4400" w:usb2="00000016" w:usb3="00000000" w:csb0="00100009" w:csb1="00000000"/></w:font><w:font w:name="Microsoft JhengHei UI"><w:panose1 w:val="020B0604030504040204"/><w:charset w:val="88"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="000002A7" w:usb1="28CF4400" w:usb2="00000016" w:usb3="00000000" w:csb0="00100009" w:csb1="00000000"/></w:font><w:font w:name="Microsoft JhengHei UI Light"><w:panose1 w:val="020B0304030504040204"/><w:charset w:val="88"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="800002A7" w:usb1="28CF4400" w:usb2="00000016" w:usb3="00000000" w:csb0="00100009" w:csb1="00000000"/></w:font><w:font w:name="Microsoft MHei"><w:panose1 w:val="020B0402040204020203"/><w:charset w:val="88"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002BF" w:usb1="3ACF7C7B" w:usb2="00000016" w:usb3="00000000" w:csb0="0010009F" w:csb1="00000000"/></w:font><w:font w:name="Microsoft NeoGothic"><w:panose1 w:val="020B0402040204020203"/><w:charset w:val="81"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="B00002BF" w:usb1="191760FB" w:usb2="00000010" w:usb3="00000000" w:csb0="0008009F" w:csb1="00000000"/></w:font><w:font w:name="Microsoft New Tai Lue"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="80000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Microsoft PhagsPa"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="08000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Microsoft Sans Serif"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E5002EFF" w:usb1="C000605B" w:usb2="00000029" w:usb3="00000000" w:csb0="000101FF" w:csb1="00000000"/></w:font><w:font w:name="Microsoft Tai Le"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="40000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Microsoft Uighur"><w:panose1 w:val="02000000000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="80002023" w:usb1="80000002" w:usb2="00000008" w:usb3="00000000" w:csb0="00000041" w:csb1="00000000"/></w:font><w:font w:name="Microsoft YaHei"><w:panose1 w:val="020B0503020204020204"/><w:charset w:val="86"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000287" w:usb1="28CF3C50" w:usb2="00000016" w:usb3="00000000" w:csb0="0004001F" w:csb1="00000000"/></w:font><w:font w:name="Microsoft YaHei Light"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="86"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000287" w:usb1="28CF0010" w:usb2="00000016" w:usb3="00000000" w:csb0="0004001F" w:csb1="00000000"/></w:font><w:font w:name="Microsoft YaHei UI"><w:panose1 w:val="020B0503020204020204"/><w:charset w:val="86"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000287" w:usb1="28CF3C50" w:usb2="00000016" w:usb3="00000000" w:csb0="0004001F" w:csb1="00000000"/></w:font><w:font w:name="Microsoft YaHei UI Light"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="86"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000287" w:usb1="28CF0010" w:usb2="00000016" w:usb3="00000000" w:csb0="0004001F" w:csb1="00000000"/></w:font><w:font w:name="Microsoft Yi Baiti"><w:panose1 w:val="03000500000000000000"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="80000003" w:usb1="00010402" w:usb2="00080002" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="MingLiU_HKSCS-ExtB"><w:panose1 w:val="02020500000000000000"/><w:charset w:val="88"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="8000002F" w:usb1="0A080008" w:usb2="00000010" w:usb3="00000000" w:csb0="00100001" w:csb1="00000000"/></w:font><w:font w:name="MingLiU-ExtB"><w:panose1 w:val="02020500000000000000"/><w:charset w:val="88"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="8000002F" w:usb1="0A080008" w:usb2="00000010" w:usb3="00000000" w:csb0="00100001" w:csb1="00000000"/></w:font><w:font w:name="Mistral"><w:panose1 w:val="03090702030407020403"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Modern No. 20"><w:panose1 w:val="02070704070505020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Mongolian Baiti"><w:panose1 w:val="03000500000000000000"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="80000023" w:usb1="00000000" w:usb2="00020000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Monotype Corsiva"><w:panose1 w:val="03010101010201010101"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="MS Gothic"><w:altName w:val="ï¼­ï¼³ ã‚´ã‚·ãƒƒã‚¯"/><w:panose1 w:val="020B0609070205080204"/><w:charset w:val="80"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="E00002FF" w:usb1="6AC7FDFB" w:usb2="08000012" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="MS PGothic"><w:panose1 w:val="020B0600070205080204"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="6AC7FDFB" w:usb2="08000012" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="MS Reference Sans Serif"><w:panose1 w:val="020B0604030504040204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="20000287" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="MS UI Gothic"><w:panose1 w:val="020B0600070205080204"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="6AC7FDFB" w:usb2="08000012" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="MV Boli"><w:panose1 w:val="02000500030200090000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000100" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Myanmar Text"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80000003" w:usb1="00000000" w:usb2="00000400" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Niagara Engraved"><w:panose1 w:val="04020502070703030202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Niagara Solid"><w:panose1 w:val="04020502070702020202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Nirmala UI"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80FF8023" w:usb1="0000004A" w:usb2="00000200" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Nirmala UI Semilight"><w:panose1 w:val="020B0402040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="80FF8023" w:usb1="0000004A" w:usb2="00000200" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="NSimSun"><w:panose1 w:val="02010609030101010101"/><w:charset w:val="86"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="00000003" w:usb1="288F0000" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/></w:font><w:font w:name="OCR A Extended"><w:panose1 w:val="02010509020102010303"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Old English Text MT"><w:panose1 w:val="03040902040508030806"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Onyx"><w:panose1 w:val="04050602080702020203"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Palace Script MT"><w:panose1 w:val="030303020206070C0B05"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Palatino Linotype"><w:panose1 w:val="02040502050505030304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E0000287" w:usb1="40000013" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Papyrus"><w:panose1 w:val="03070502060502030205"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Parchment"><w:panose1 w:val="03040602040708040804"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Perpetua"><w:panose1 w:val="02020502060401020303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Perpetua Titling MT"><w:panose1 w:val="02020502060505020804"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Playbill"><w:panose1 w:val="040506030A0602020202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="PMingLiU-ExtB"><w:panose1 w:val="02020500000000000000"/><w:charset w:val="88"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="8000002F" w:usb1="0A080008" w:usb2="00000010" w:usb3="00000000" w:csb0="00100001" w:csb1="00000000"/></w:font><w:font w:name="Poor Richard"><w:panose1 w:val="02080502050505020702"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Pristina"><w:panose1 w:val="03060402040406080204"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Rage Italic"><w:panose1 w:val="03070502040507070304"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Ravie"><w:panose1 w:val="04040805050809020602"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Rockwell"><w:panose1 w:val="02060603020205020403"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Rockwell Condensed"><w:panose1 w:val="02060603050405020104"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Rockwell Extra Bold"><w:panose1 w:val="02060903040505020403"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Script MT Bold"><w:panose1 w:val="03040602040607080904"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Segoe MDL2 Assets"><w:panose1 w:val="050A0102010101010101"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="10000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Segoe Print"><w:panose1 w:val="02000600000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="0000028F" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Segoe Script"><w:panose1 w:val="030B0504020000000003"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="0000028F" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Black"><w:panose1 w:val="020B0A02040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E10002FF" w:usb1="4000E47F" w:usb2="00000021" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Emoji"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="02000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Historic"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="800001EF" w:usb1="02000002" w:usb2="0060C080" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Light"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Semibold"><w:panose1 w:val="020B0702040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Semilight"><w:panose1 w:val="020B0402040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe UI Symbol"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="800001E3" w:usb1="1200FFEF" w:usb2="00040000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Segoe WP"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe WP Black"><w:panose1 w:val="020B0A02040504020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002BF" w:usb1="100000FB" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Segoe WP Light"><w:panose1 w:val="020B0502040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe WP Semibold"><w:panose1 w:val="020B0702040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Segoe WP SemiLight"><w:panose1 w:val="020B0402040204020203"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E4002EFF" w:usb1="C000E47F" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Showcard Gothic"><w:panose1 w:val="04020904020102020604"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="SimSun"><w:altName w:val="å®‹ä½“"/><w:panose1 w:val="02010600030101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="288F0000" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/></w:font><w:font w:name="SimSun-ExtB"><w:panose1 w:val="02010609060101010101"/><w:charset w:val="86"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="00000003" w:usb1="0A0E0000" w:usb2="00000010" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/></w:font><w:font w:name="Sitka Banner"><w:panose1 w:val="02000505000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Sitka Display"><w:panose1 w:val="02000505000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Sitka Heading"><w:panose1 w:val="02000505000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Sitka Small"><w:panose1 w:val="02000505000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Sitka Subheading"><w:panose1 w:val="02000505000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Sitka Text"><w:panose1 w:val="02000505000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000204B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Snap ITC"><w:panose1 w:val="04040A07060A02020202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Stencil"><w:panose1 w:val="040409050D0802020404"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Sylfaen"><w:panose1 w:val="010A0502050306030303"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="04000687" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Tahoma"><w:panose1 w:val="020B0604030504040204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E1002EFF" w:usb1="C000605B" w:usb2="00000029" w:usb3="00000000" w:csb0="000101FF" w:csb1="00000000"/></w:font><w:font w:name="Tempus Sans ITC"><w:panose1 w:val="04020404030D07020202"/><w:charset w:val="00"/><w:family w:val="decorative"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Trebuchet MS"><w:panose1 w:val="020B0603020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000687" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="0000009F" w:csb1="00000000"/></w:font><w:font w:name="Tw Cen MT"><w:panose1 w:val="020B0602020104020603"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Tw Cen MT Condensed Extra Bold"><w:panose1 w:val="020B0803020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="00000007" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000003" w:csb1="00000000"/></w:font><w:font w:name="Verdana"><w:panose1 w:val="020B0604030504040204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A10006FF" w:usb1="4000205B" w:usb2="00000010" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Viner Hand ITC"><w:panose1 w:val="03070502030502020203"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Vivaldi"><w:panose1 w:val="03020602050506090804"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Vladimir Script"><w:panose1 w:val="03050402040407070305"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Wide Latin"><w:panose1 w:val="020A0A07050505020404"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic"><w:altName w:val="æ¸¸ã‚´ã‚·ãƒƒã‚¯"/><w:panose1 w:val="020B0400000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic Light"><w:panose1 w:val="020B0300000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic Medium"><w:panose1 w:val="020B0500000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic UI"><w:panose1 w:val="020B0500000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic UI Light"><w:panose1 w:val="020B0300000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic UI Semibold"><w:panose1 w:val="020B0700000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font><w:font w:name="Yu Gothic UI Semilight"><w:panose1 w:val="020B0400000000000000"/><w:charset w:val="80"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="2AC7FDFF" w:usb2="00000016" w:usb3="00000000" w:csb0="0002009F" w:csb1="00000000"/></w:font></w:fonts>
`;
const settingsContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" mc:Ignorable="w14 w15 w16se"><w:zoom w:percent="100"/><w:proofState w:spelling="clean" w:grammar="clean"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="differentiateMultirowTableHeaders" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/></w:compat><w:rsids><w:rsidRoot w:val="00451743"/><w:rsid w:val="00451743"/><w:rsid w:val="00E22951"/><w:rsid w:val="00F91D03"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="1026"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val="."/><w:listSeparator w:val=","/><w14:docId w14:val="0984D679"/><w15:chartTrackingRefBased/><w15:docId w15:val="{C97DF782-B04A-4DC6-85C5-915FA0D536FB}"/></w:settings>`;
const stylesContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="0" w:defUnhideWhenUsed="0" w:defQFormat="0" w:count="374"><w:lsdException w:name="Normal" w:uiPriority="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 2" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 3" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 4" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 5" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 6" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 7" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 8" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 9" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="index 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 9" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 1" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 2" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 3" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 4" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 5" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 6" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 7" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 8" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 9" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footnote text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="header" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footer" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="caption" w:semiHidden="1" w:uiPriority="35" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="table of figures" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="envelope address" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="envelope return" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footnote reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="line number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="page number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="endnote reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="endnote text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="table of authorities" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="macro" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="toa heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Title" w:uiPriority="10" w:qFormat="1"/><w:lsdException w:name="Closing" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Signature" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Default Paragraph Font" w:semiHidden="1" w:uiPriority="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Message Header" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Subtitle" w:uiPriority="11" w:qFormat="1"/><w:lsdException w:name="Salutation" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Date" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text First Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text First Indent 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Note Heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Block Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Hyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="FollowedHyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Strong" w:uiPriority="22" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:uiPriority="20" w:qFormat="1"/><w:lsdException w:name="Document Map" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Plain Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="E-mail Signature" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Top of Form" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Bottom of Form" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal (Web)" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Acronym" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Address" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Cite" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Code" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Definition" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Keyboard" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Preformatted" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Sample" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Typewriter" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Variable" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal Table" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation subject" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="No List" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Contemporary" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Elegant" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Professional" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Subtle 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Subtle 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Balloon Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid" w:uiPriority="39"/><w:lsdException w:name="Table Theme" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Placeholder Text" w:semiHidden="1"/><w:lsdException w:name="No Spacing" w:uiPriority="1" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:uiPriority="60"/><w:lsdException w:name="Light List" w:uiPriority="61"/><w:lsdException w:name="Light Grid" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2" w:uiPriority="64"/><w:lsdException w:name="Medium List 1" w:uiPriority="65"/><w:lsdException w:name="Medium List 2" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3" w:uiPriority="69"/><w:lsdException w:name="Dark List" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading" w:uiPriority="71"/><w:lsdException w:name="Colorful List" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 1" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 1" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 1" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 1" w:uiPriority="65"/><w:lsdException w:name="Revision" w:semiHidden="1"/><w:lsdException w:name="List Paragraph" w:uiPriority="34" w:qFormat="1"/><w:lsdException w:name="Quote" w:uiPriority="29" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:uiPriority="30" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 1" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 1" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 1" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 1" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 2" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 2" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 2" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 2" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 2" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 2" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 2" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 2" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 2" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 3" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 3" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 3" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 3" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 3" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 3" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 3" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 3" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 3" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 4" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 4" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 4" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 4" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 4" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 4" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 4" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 4" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 4" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 5" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 5" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 5" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 5" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 5" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 5" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 5" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 5" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 5" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 6" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 6" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 6" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 6" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 6" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 6" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 6" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 6" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 6" w:uiPriority="73"/><w:lsdException w:name="Subtle Emphasis" w:uiPriority="19" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:uiPriority="21" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:uiPriority="31" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:uiPriority="32" w:qFormat="1"/><w:lsdException w:name="Book Title" w:uiPriority="33" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:semiHidden="1" w:uiPriority="37" w:unhideWhenUsed="1"/><w:lsdException w:name="TOC Heading" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="Plain Table 1" w:uiPriority="41"/><w:lsdException w:name="Plain Table 2" w:uiPriority="42"/><w:lsdException w:name="Plain Table 3" w:uiPriority="43"/><w:lsdException w:name="Plain Table 4" w:uiPriority="44"/><w:lsdException w:name="Plain Table 5" w:uiPriority="45"/><w:lsdException w:name="Grid Table Light" w:uiPriority="40"/><w:lsdException w:name="Grid Table 1 Light" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 1" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 1" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 1" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 1" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 1" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 1" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 1" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 2" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 2" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 2" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 2" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 2" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 2" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 2" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 3" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 3" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 3" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 3" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 3" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 3" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 3" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 4" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 4" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 4" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 4" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 4" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 4" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 4" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 5" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 5" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 5" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 5" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 5" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 5" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 5" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 6" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 6" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 6" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 6" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 6" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 6" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 6" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light" w:uiPriority="46"/><w:lsdException w:name="List Table 2" w:uiPriority="47"/><w:lsdException w:name="List Table 3" w:uiPriority="48"/><w:lsdException w:name="List Table 4" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 1" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 1" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 1" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 1" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 1" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 1" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 1" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 2" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 2" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 2" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 2" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 2" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 2" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 2" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 3" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 3" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 3" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 3" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 3" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 3" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 3" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 4" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 4" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 4" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 4" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 4" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 4" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 4" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 5" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 5" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 5" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 5" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 5" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 5" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 5" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 6" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 6" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 6" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 6" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 6" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 6" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 6" w:uiPriority="52"/><w:lsdException w:name="Mention" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Smart Hyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Hashtag" w:semiHidden="1" w:unhideWhenUsed="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style></w:styles>
`;
const webSettingsContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" mc:Ignorable="w14 w15 w16se"><w:optimizeForBrowser/><w:allowPNG/></w:webSettings>`;
// wordRelsContent = "";
const wordRelsParts = [`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>`,`</Relationships>`];
const wordThemeContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="æ¸¸ã‚´ã‚·ãƒƒã‚¯ Light"/><a:font script="Hang" typeface="ë§‘ì€ ê³ ë”•"/><a:font script="Hans" typeface="ç­‰çº¿ Light"/><a:font script="Hant" typeface="æ–°ç´°æ˜Žé«”"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="æ¸¸æ˜Žæœ"/><a:font script="Hang" typeface="ë§‘ì€ ê³ ë”•"/><a:font script="Hans" typeface="ç­‰çº¿"/><a:font script="Hant" typeface="æ–°ç´°æ˜Žé«”"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>`;
const pageNumXML = `<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE   \\* MERGEFORMAT </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:noProof/></w:rPr><w:t>2</w:t></w:r><w:r><w:rPr><w:noProof/></w:rPr><w:fldChar w:fldCharType="end"/></w:r>`;
const tabXML = `<w:r><w:tab/></w:r>`; 

export default class WriteDoc {
  constructor(props) {
    // super(props);
    // this.state = {isToggleOn: true};
	this.write = WriteDoc.write.bind(this);
	this.setHeaders = WriteDoc.setHeaders.bind(this);
	this.setContentTypes = WriteDoc.setContentTypes.bind(this);
	this.setRels = WriteDoc.setRels.bind(this);
	this.setCore = WriteDoc.setCore.bind(this);
	this.setTitlePage = WriteDoc.setTitlePage.bind(this);
	this.setSummaryConclusion = WriteDoc.setSummaryConclusion.bind(this);
	this.setBody = WriteDoc.setBody.bind(this);
	this.setReferences = WriteDoc.setReferences.bind(this);
	this.setHeaderInfo = WriteDoc.setHeaderInfo.bind(this);
	this.setDocument = WriteDoc.setDocument.bind(this);	
  }

  static write(paperObj) {
	var shell = electron.shell;
    var app = electron.remote; 
    var dialog = app.dialog;
	let archiver = require('archiver');
	dialog.showSaveDialog({filters: [{ name: 'DocX files', extensions: ['docx'] }]}, function(filename) {
		//console.log(filename);
		var saveName = filename;
		let coreContent = WriteDoc.setCore();
		let wordDocumentContent = WriteDoc.setDocument(paperObj);
		let wordRelsContent = WriteDoc.setRels(paperObj);
		let contentTypesContent = WriteDoc.setContentTypes(paperObj);
		let headersContent = WriteDoc.setHeaders(paperObj.headers);
		if (!saveName || saveName.length < 1) {
			alert("Document not saved.");
			return;
		}
		if (saveName.split(".docx").length < 1) {
			saveName += ".docx";
		}

		var output = fs.createWriteStream('lucky.zip');
		var archive = archiver('zip');

		output.on('close', function () {
			console.log(archive.pointer() + ' total bytes');
			console.log('archiver has been finalized and the output file descriptor has closed.');
		});

		archive.on('error', function(err){
			throw err;
		});

		archive.pipe(output);
		archive.append(contentTypesContent, { name: '[Content_Types].xml' });
		archive.append(wordDocumentContent, { name: 'word\\document.xml' });
		archive.append(fontTableContent, { name: 'word\\fontTable.xml' });
		archive.append(settingsContent, { name: 'word\\settings.xml' });
		archive.append(stylesContent, { name: 'word\\styles.xml' });
		archive.append(webSettingsContent, { name: 'word\\webSettings.xml' });
		archive.append(wordRelsContent, { name: 'word\\_rels\\document.xml.rels' });
		if (paperObj.headers.includeHeaders) {
			archive.append(emptyHeaderContent, { name: 'word\\header1.xml' });
			archive.append(headersContent.header2, { name: 'word\\header2.xml' });
			archive.append(headersContent.header3, { name: 'word\\header3.xml' });
			archive.append(emptyFooterContent, { name: 'word\\footer1.xml' });
			archive.append(emptyFooterContent, { name: 'word\\footer2.xml' });
			archive.append(emptyFooterContent, { name: 'word\\footer3.xml' });
			archive.append(footNotesContent, { name: 'word\\footnotes.xml' });
			archive.append(endNotesContent, { name: 'word\\endnotes.xml' });
		}
		archive.append(wordThemeContent, { name: 'word\\theme\\theme1.xml' });
		archive.append(relsContent, { name: '_rels\\.rels' });
		archive.append(appContent, { name: 'docProps\\app.xml' });
		archive.append(coreContent, { name: 'docProps\\core.xml' });
		archive.finalize();

		fs.renameSync('lucky.zip', saveName);
	});
  }

  static setHeaders(headerObj) {
	let header2Content = "";
	let header3Content = "";
	header2Content += headerParts[0];
	header3Content += headerParts[0];
	var firstPageDifferent = headerObj.diffFirstPage;
	var newFont = headerObj.font;
	var fontSize = headerObj.fontSize;
	//header2.xml = default, header3.xml = first page
	var defaultHeader;
	for (var h in headerObj.headers) {
		var header = headerObj.headers[h];
		if (header.applyTo === "default") {
			defaultHeader = header;
		}
	}
	if (firstPageDifferent) {
		var firstPageHeader;
		for (h in headerObj.headers) {
			var header = headerObj.headers[h];
			if (header.applyTo === "firstPage") {
				firstPageHeader = header;
			}
		}
		if (firstPageHeader.leftType === "text") {
			header3Content += `<w:r><w:t>${firstPageHeader.left}</w:t></w:r>`;
		}
		else if (firstPageHeader.leftType === "pageNumber") {
			header3Content += pageNumXML;
		}
		header3Content += tabXML;
		if (firstPageHeader.rightType === "text") {
			header3Content += `<w:r><w:rPr><w:noProof/></w:rPr><w:t>${firstPageHeader.right}</w:t></w:r>`;
		}
		else if (firstPageHeader.rightType === "pageNumber") {
			header3Content += pageNumXML;
		}
	}
	else {
		if (defaultHeader.leftType === "text") {
			header3Content += `<w:r><w:t>${defaultHeader.left}</w:t></w:r>`;
		}
		else if (defaultHeader.leftType === "pageNumber") {
			header3Content += pageNumXML;
		}
		header3Content += tabXML;
		if (defaultHeader.rightType === "text") {
			header3Content += `<w:r><w:rPr><w:noProof/></w:rPr><w:t>${defaultHeader.right}</w:t></w:r>`;
		}
		else if (defaultHeader.rightType === "pageNumber") {
			header3Content += pageNumXML;
		}
	}
	if (defaultHeader.leftType === "text") {
		header2Content += `<w:r><w:t>${defaultHeader.left}</w:t></w:r>`;
	}
	else if (defaultHeader.leftType === "pageNumber") {
		header2Content += pageNumXML;
	}
	header2Content += tabXML;
	if (defaultHeader.rightType === "text") {
		header2Content += `<w:r><w:rPr><w:noProof/></w:rPr><w:t>${defaultHeader.right}</w:t></w:r>`;
	}
	else if (defaultHeader.rightType === "pageNumber") {
		header2Content += pageNumXML;
	}
	header2Content += headerParts[1];
	header3Content += headerParts[1];
	return {header2: header2Content, header3: header3Content};
  }

  static setContentTypes(paperObj) {
        let contentTypesContent = contentTypesParts[0];
        if (paperObj.headers.includeHeaders) {
            contentTypesContent += `<Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/><Override PartName="/word/endnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/header2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/word/header3.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer3.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>`;
        }
        contentTypesContent += contentTypesParts[1];
		return contentTypesContent;
    }

    static setRels(paperObj) {
        let wordRelsContent = wordRelsParts[0];
        if (paperObj.headers.includeHeaders) {
            wordRelsContent += `<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header2.xml"/><Relationship Id="rId10" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header3.xml"/><Relationship Id="rId8" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/><Relationship Id="rId9" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer2.xml"/><Relationship Id="rId11" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer3.xml"/>`;
        }
        wordRelsContent += wordRelsParts[1];
		return wordRelsContent;
    }

    static setCore() {
        //2017-01-21T16:34:00Z
        var today = new Date();
        var month = today.getMonth() > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
        var day = today.getDate() > 9 ? today.getDate() : `0${today.getDate()}`;
        var hours = today.getHours() > 9 ? today.getHours() : `0${today.getHours()}`;
        var minutes = today.getMinutes() > 9 ? today.getMinutes() : `0${today.getMinutes()}`;
        var totoInsert = `${today.getFullYear()}-${month}-${day}T${hours}:${minutes}:00Z`;
        let coreContent = `${coreContentParts[0]}${totoInsert}${coreContentParts[1]}${totoInsert}${coreContentParts[2]}`;
		return coreContent;
    }

    static setTitlePage(titleObj) {
        var toReturn = "";
        var numFields = titleObj.fields.length;
        var emptyLineCount = 12 - Math.floor(numFields / 2)
        var onOwnPage = titleObj.onOwnPage;
        var alignment = titleObj.alignment;
        var bold = titleObj.bold;
        var italics = titleObj.italicize;
        var underline = titleObj.underline;    
        var newFont = titleObj.font;
        var fontSize = titleObj.fontSize * 2;
        if (onOwnPage) {
            for (var i = 0; i < emptyLineCount; i++) {
                toReturn += emptyParagraphXML;
            }
        }    
        for (var f in titleObj.fields) {
            var field = titleObj.fields[f];
            var toInsert = field.value;
            toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
            toReturn += `<w:pPr><w:jc w:val="${alignment}"/></w:pPr>`;
            var labelContentText = "";
            if (!bold && !italics && !underline) {
                /*no bold, italics, or underlined*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;                    
            }
            else if (!bold && !italics && underline) {
                /*no bold or italics yes underlined*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (!bold && italics && !underline) {
                /*no bold or underlined yes italics*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (!bold && italics && underline) {
                /*no bold yes italics and underlined*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && !italics && !underline) {
                /*no italics or underlined yes bold*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && !italics && underline) {
                /*no italics yes bold and underlined*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && italics && !underline) {
                /*no underlined yes bold and italics*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && italics && underline) {
                /*yes bold, italics, and underlined*/
                labelContentText = `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else {                
                console.log("You got some weird outliers!");
            }
            toReturn += labelContentText;
            toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;        
        }
        if (onOwnPage) {
            toReturn += pageBreakXML;
        }
        return toReturn;
    }

    static setSummaryConclusion(sectionObj, breakBefore) {
        var toReturn = "";
        var onOwnPage = sectionObj.onOwnPage;
        var includeLabel = sectionObj.includeLabel;
        var position;
        var labelContentText;
        if (breakBefore && onOwnPage) {
            toReturn += pageBreakXML;
        }
        if (includeLabel) {
            var sectionLabel = sectionObj.label;
            position = sectionLabel.position;     
            var alignment = sectionLabel.alignment;       
            toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
            var bold = sectionLabel.bold;
            var italics = sectionLabel.italicize;
            var underline = sectionLabel.underline;
            var toInsert = sectionLabel.labelText;
            var newFont = sectionLabel.font;
            var fontSize = sectionLabel.fontSize * 2;
            var labelEnd = "";
            labelContentText = "";
            var alignmentStr = ""
            if (position === "inline") {
                labelEnd = ". ";
            } 
            else {
                alignmentStr = `<w:pPr><w:jc w:val="${alignment}"/></w:pPr>`;
            }
            
            if (!bold && !italics && !underline) {
                /*no bold, italics, or underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;                    
            }
            else if (!bold && !italics && underline) {
                /*no bold or italics yes underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else if (!bold && italics && !underline) {
                /*no bold or underlined yes italics*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else if (!bold && italics && underline) {
                /*no bold yes italics and underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else if (bold && !italics && !underline) {
                /*no italics or underlined yes bold*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else if (bold && !italics && underline) {
                /*no italics yes bold and underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else if (bold && italics && !underline) {
                /*no underlined yes bold and italics*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else if (bold && italics && underline) {
                /*yes bold, italics, and underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
            }
            else {                
                console.log("You got some weird outliers!");
            }
            if (position === "lineBefore") {
                toReturn += labelContentText;
                toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;
            }
            else if (position === "inline") {
                
            }            
        }
        var firstOfPara = true;
        var firstOfPara2 = true;
        for (var p in sectionObj.paragraphs) {
            var paragraph = sectionObj.paragraphs[p];
            if (includeLabel) {
                if (firstOfPara) {
                    firstOfPara = false;
                    if (position !== "inline") {                    
                        toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
                    }
                }
                else if (!firstOfPara) {
                    toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
                }
            }
            else {
                toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
            }
            
            var topIndent = paragraph.topIndent * 720;
            var bottomIndent = paragraph.bottomIndent * 720;
            var spacingStr = "";
            if (topIndent === bottomIndent && topIndent > 0) {
                spacingStr = `<w:ind w:left="${topIndent}"/>`;
            }
            else if (topIndent > bottomIndent && bottomIndent > 0) {
                spacingStr = `<w:ind w:left="${bottomIndent}" w:firstLine="${topIndent - bottomIndent}"/>`;
            }
            else if (topIndent > bottomIndent) {
                spacingStr = `<w:ind w:firstLine="${topIndent}"/>`;
            }
            else if (bottomIndent > topIndent) {
                spacingStr = `<w:ind w:left="${topIndent + bottomIndent}" w:hanging="${bottomIndent - topIndent}"/>`;
            }
            var spacing = paragraph.spacing * 240;
            var alignmentInfo = `<w:jc w:val="${paragraph.alignment}"/>`;
            toReturn += `<w:pPr>${alignmentInfo}<w:spacing w:after="0" w:line="${spacing}" w:lineRule="auto"/>${spacingStr}<w:contextualSpacing/></w:pPr>`;

            if (includeLabel && firstOfPara2 && position === "inline") {
                firstOfPara2 = false;
                toReturn += labelContentText;
            }

            for (var f in paragraph.formatSections) {
                var formatSection = paragraph.formatSections[f];
                var newFont = formatSection.font;
                var fontSize = formatSection.fontSize * 2;
                var toInsert= formatSection.content;
                var bold = formatSection.bold;
                var italics = formatSection.italicize;
                var underline = formatSection.underline;

                if (!bold && !italics && !underline) {
                    /*no bold, italics, or underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;                    
                }
                else if (!bold && !italics && underline) {
                    /*no bold or italics yes underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else if (!bold && italics && !underline) {
                    /*no bold or underlined yes italics*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else if (!bold && italics && underline) {
                    /*no bold yes italics and underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else if (bold && !italics && !underline) {
                    /*no italics or underlined yes bold*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else if (bold && !italics && underline) {
                    /*no italics yes bold and underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else if (bold && italics && !underline) {
                    /*no underlined yes bold and italics*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else if (bold && italics && underline) {
                    /*yes bold, italics, and underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                }
                else {                
                    console.log("You got some weird outliers!");
                }
            }
            toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;
        }
        if (!breakBefore && onOwnPage) {
            toReturn += pageBreakXML;
        }
        return toReturn;
    }

    static setBody(bodyObj) {
        var toReturn = "";
        var sections = bodyObj.sections;    
        for(var s in sections) {
            var section = sections[s];
            var position;
            var labelContentText;
            if (section.includeLabel) {
                //TODO add label handling
                var sectionLabel = section.label;
                position = sectionLabel.position;     
                var alignment = sectionLabel.alignment;       
                toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
                var bold = sectionLabel.bold;
                var italics = sectionLabel.italicize;
                var underline = sectionLabel.underline;
                var toInsert= sectionLabel.labelText;
                var newFont = sectionLabel.font;
                var fontSize = sectionLabel.fontSize * 2;
                var labelEnd = "";
                labelContentText = "";
                var alignmentStr = ""
                if (position === "inline") {
                    labelEnd = ". ";
                } 
                else {
                    alignmentStr = `<w:pPr><w:jc w:val="${alignment}"/></w:pPr>`;
                }
                
                if (!bold && !italics && !underline) {
                    /*no bold, italics, or underlined*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;                    
                }
                else if (!bold && !italics && underline) {
                    /*no bold or italics yes underlined*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else if (!bold && italics && !underline) {
                    /*no bold or underlined yes italics*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else if (!bold && italics && underline) {
                    /*no bold yes italics and underlined*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else if (bold && !italics && !underline) {
                    /*no italics or underlined yes bold*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else if (bold && !italics && underline) {
                    /*no italics yes bold and underlined*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else if (bold && italics && !underline) {
                    /*no underlined yes bold and italics*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else if (bold && italics && underline) {
                    /*yes bold, italics, and underlined*/
                    labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}${labelEnd}</w:t></w:r>`;
                }
                else {                
                    console.log("You got some weird outliers!");
                }
                if (position === "lineBefore") {
                    toReturn += labelContentText;
                    toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;
                }
                else if (position === "inline") {
                    
                }            
            }
            var firstOfPara = true;
            var firstOfPara2 = true;
            for (var p in section.paragraphs) {
                var paragraph = section.paragraphs[p];
                if (section.includeLabel) {
                    if (firstOfPara) {
                        firstOfPara = false;
                        if (position !== "inline") {                    
                            toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
                        }
                    }
                    else if (!firstOfPara) {
                        toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
                    }
                }
                else {
                    toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
                }
                
                var topIndent = paragraph.topIndent * 720;
                var bottomIndent = paragraph.bottomIndent * 720;
                var spacingStr = "";
                if (topIndent === bottomIndent && topIndent > 0) {
                    spacingStr = `<w:ind w:left="${topIndent}"/>`;
                }
                else if (topIndent > bottomIndent && bottomIndent > 0) {
                    spacingStr = `<w:ind w:left="${bottomIndent}" w:firstLine="${topIndent - bottomIndent}"/>`;
                }
                else if (topIndent > bottomIndent) {
                    spacingStr = `<w:ind w:firstLine="${topIndent}"/>`;
                }
                else if (bottomIndent > topIndent) {
                    spacingStr = `<w:ind w:left="${topIndent + bottomIndent}" w:hanging="${bottomIndent - topIndent}"/>`;
                }
                var spacing = paragraph.spacing * 240;
                var alignmentInfo = `<w:jc w:val="${paragraph.alignment}"/>`;
                toReturn += `<w:pPr>${alignmentInfo}<w:spacing w:after="0" w:line="${spacing}" w:lineRule="auto"/>${spacingStr}<w:contextualSpacing/></w:pPr>`;

                if (section.includeLabel && firstOfPara2 && position === "inline") {
                    firstOfPara2 = false;
                    toReturn += labelContentText;
                }

                for (var f in paragraph.formatSections) {
                    var formatSection = paragraph.formatSections[f];
                    var newFont = formatSection.font;
                    var fontSize = formatSection.fontSize * 2;
                    var toInsert = formatSection.content;
                    var bold = formatSection.bold;
                    var italics = formatSection.italicize;
                    var underline = formatSection.underline;

                    if (!bold && !italics && !underline) {
                        /*no bold, italics, or underlined*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;                    
                    }
                    else if (!bold && !italics && underline) {
                        /*no bold or italics yes underlined*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else if (!bold && italics && !underline) {
                        /*no bold or underlined yes italics*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else if (!bold && italics && underline) {
                        /*no bold yes italics and underlined*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else if (bold && !italics && !underline) {
                        /*no italics or underlined yes bold*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else if (bold && !italics && underline) {
                        /*no italics yes bold and underlined*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else if (bold && italics && !underline) {
                        /*no underlined yes bold and italics*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else if (bold && italics && underline) {
                        /*yes bold, italics, and underlined*/
                        toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
                    }
                    else {                
                        console.log("You got some weird outliers!");
                    }
                }
                toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;
            }
        }
        return toReturn;
    }

    static setReferences(referencesObj) {
        var toReturn = "";
        var onOwnPage = referencesObj.onOwnPage;
        if (onOwnPage) {
            toReturn += pageBreakXML;
        }
        var includeLabel = referencesObj.includeLabel;
        if (includeLabel) {
            var sectionLabel = referencesObj.label;    
            var alignment = sectionLabel.alignment;       
            toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
            var bold = sectionLabel.bold;
            var italics = sectionLabel.italicize;
            var underline = sectionLabel.underline;
            var toInsert = sectionLabel.labelText;
            var newFont = sectionLabel.font;
            var fontSize = sectionLabel.fontSize * 2;
            var labelContentText = "";
            var alignmentStr = `<w:pPr><w:jc w:val="${alignment}"/></w:pPr>`;
            
            if (!bold && !italics && !underline) {
                /*no bold, italics, or underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;                    
            }
            else if (!bold && !italics && underline) {
                /*no bold or italics yes underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (!bold && italics && !underline) {
                /*no bold or underlined yes italics*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (!bold && italics && underline) {
                /*no bold yes italics and underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && !italics && !underline) {
                /*no italics or underlined yes bold*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && !italics && underline) {
                /*no italics yes bold and underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && italics && !underline) {
                /*no underlined yes bold and italics*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else if (bold && italics && underline) {
                /*yes bold, italics, and underlined*/
                labelContentText = `${alignmentStr}<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert}</w:t></w:r>`;
            }
            else {                
                console.log("You got some weird outliers!");
            }
            toReturn += labelContentText;
            toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;        
        }
        var topIndent = referencesObj.topIndent * 720;
        var bottomIndent = referencesObj.bottomIndent * 720;
        var spacingStr = "";
        if (topIndent === bottomIndent && topIndent > 0) {
            spacingStr = `<w:ind w:left="${topIndent}"/>`;
        }
        else if (topIndent > bottomIndent && bottomIndent > 0) {
            spacingStr = `<w:ind w:left="${bottomIndent}" w:firstLine="${topIndent - bottomIndent}"/>`;
        }
        else if (topIndent > bottomIndent) {
            spacingStr = `<w:ind w:firstLine="${topIndent}"/>`;
        }
        else if (bottomIndent > topIndent) {
            spacingStr = `<w:ind w:left="${topIndent + bottomIndent}" w:hanging="${bottomIndent - topIndent}"/>`;
        }
        var spacing = referencesObj.spacing * 240;
        var alignmentInfo = `<w:jc w:val="${referencesObj.alignment}"/>`;
        var paragraphSettings = `<w:pPr>${alignmentInfo}<w:spacing w:after="0" w:line="${spacing}" w:lineRule="auto"/>${spacingStr}<w:contextualSpacing/></w:pPr>`;
        var newFont = referencesObj.font;
        var fontSize = referencesObj.fontSize * 2;

        for (var r in referencesObj.citations) {
            var reference = referencesObj.citations[r];
            toReturn += `<w:p w:rsidR="00E22951" w:rsidRDefault="00451743">`;
            toReturn += paragraphSettings;
            for (var f in reference.fields) {
                var field = reference.fields[f];
                var bold = field.bold;
                var italics = field.italicize;
                var underline = field.underline;
                var inQuotes = field.inQuotes;
                var inParens = field.inParens;
                var toInsert= ""
                if (inParens) {
                    toInsert += "(";
                }
                if (inQuotes) {
                    toInsert += "\"";
                }
                toInsert += field.value;
                if (inQuotes) {
                    toInsert += "\"";
                }
                if (inParens) {
                    toInsert += ")";
                }

                if (!bold && !italics && !underline) {
                    /*no bold, italics, or underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;                    
                }
                else if (!bold && !italics && underline) {
                    /*no bold or italics yes underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else if (!bold && italics && !underline) {
                    /*no bold or underlined yes italics*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else if (!bold && italics && underline) {
                    /*no bold yes italics and underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else if (bold && !italics && !underline) {
                    /*no italics or underlined yes bold*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else if (bold && !italics && underline) {
                    /*no italics yes bold and underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else if (bold && italics && !underline) {
                    /*no underlined yes bold and italics*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else if (bold && italics && underline) {
                    /*yes bold, italics, and underlined*/
                    toReturn += `<w:r w:rsidRPr="00613080"><w:rPr><w:rFonts w:ascii="${newFont}" w:hAnsi="${newFont}"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/><w:b/><w:i/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">${toInsert} </w:t></w:r>`;
                }
                else {                
                    console.log("You got some weird outliers!");
                }
            }        

            toReturn += `<w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>`;  
        }

        return toReturn;
    }

    static setHeaderInfo(headerObj) {
        var toReturn = "";
        if (headerObj.includeHeaders) {
            toReturn += `<w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:footerReference w:type="first" r:id="rId11"/>`;
        }
        return toReturn;
    }

    static setDocument(myDoc) {
        let wordDocumentContent = wordDocumentContentParts[0];

        wordDocumentContent += WriteDoc.setTitlePage(myDoc.titleInfo);
        wordDocumentContent += WriteDoc.setSummaryConclusion(myDoc.summaryAbstract, false);
        wordDocumentContent += WriteDoc.setBody(myDoc.body);
        wordDocumentContent += WriteDoc.setSummaryConclusion(myDoc.conclusion, true);
        wordDocumentContent += WriteDoc.setReferences(myDoc.references);
        wordDocumentContent += wordDocumentContentParts[1];
        wordDocumentContent += WriteDoc.setHeaderInfo(myDoc.headers);
        wordDocumentContent += wordDocumentContentParts[2];
        wordDocumentContent += `<w:titlePg/>`;
        wordDocumentContent += wordDocumentContentParts[3];
		return wordDocumentContent;
    }

   
}